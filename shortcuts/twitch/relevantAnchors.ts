import { didHrefChange } from '../../utils/locationUtils'
import { whenElementMutates } from '../../utils/mutationUtils'
import { ShortcutsCategory } from '../Shortcuts'

const didPageHrefChange = didHrefChange()

const category = new ShortcutsCategory('Relevant content (stream, video...)', 'Relevant anchors')
export default category

let relevantAnchors: HTMLAnchorElement[] = []
let showMoreRelevantButtons: HTMLButtonElement[] = []
let relevantAnchorIndex = -1
const relevantAnchorScrollHeight = 120
const relevantAnchorScrollHeightHomePageAdjustment = 100
let isOnHomePage: HTMLElement | null // Scroll height on channel pages must be adjusted
let scrollToAndFocusCurrentRelevantAnchor: () => void
let updateRelevantAnchorsAborts: AbortController[] = []
function updateRelevantAnchorIndex(toIndex: number) {
  return function () {
    relevantAnchorIndex = toIndex
  }
}

// TODO add channel anchors to a list of relevant anchors
// Should get streams, videos, clips, categories
function getRelevantAnchors() {
  updateRelevantAnchorsAborts.forEach((abortController) => abortController.abort())
  updateRelevantAnchorsAborts = []

  const twTowersAndShowMoreButtons = document.querySelectorAll(':is([data-test-selector="view-all"], .tw-tower, .show-more__move-up button)')

  showMoreRelevantButtons = []
  const relevantAnchorsParents: HTMLElement[] = []
  for (let i = 0; i < twTowersAndShowMoreButtons.length; i++) {
    const currentTower = twTowersAndShowMoreButtons[i]
    if (!currentTower.classList.contains('tw-tower')) continue

    let showMoreButton: HTMLButtonElement
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (twTowersAndShowMoreButtons[i - 1]?.tagName === 'H5') {
      showMoreButton = twTowersAndShowMoreButtons[i - 1] as HTMLButtonElement
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (twTowersAndShowMoreButtons[i + 1]?.tagName === 'BUTTON') {
      showMoreButton = twTowersAndShowMoreButtons[i + 1] as HTMLButtonElement
    }
    // Page will not have new showMore buttons when towers mutate
    // However it is necessary to push new references to showMoreRelevantButtons when new relevantAnchors are added
    currentTower.querySelectorAll<HTMLElement>(':is(article, .game-card)').forEach((relevantParent) => {
      if (!relevantParent.offsetParent) return
      showMoreRelevantButtons.push(showMoreButton)
      relevantAnchorsParents.push(relevantParent)
    })
  }
  // console.log('showMoreButtons', showMoreRelevantButtons)

  // Selectors in order:
  // streams, categories, clips and videos
  relevantAnchors = []
  relevantAnchorsParents.forEach((relevantAnchorParent) => relevantAnchors.push(relevantAnchorParent.querySelector<HTMLAnchorElement>(`:is(
    a.tw-link[data-test-selector="TitleAndChannel"],
    [data-test-selector="tw-card-title"] a.tw-link,
    a.tw-link[lines]
  )`)!))
  // console.log('relevantAnchors', relevantAnchors)

  const rootScrollContentElement = relevantAnchorsParents[0]?.closest('.simplebar-scroll-content')
  scrollToAndFocusCurrentRelevantAnchor = () => {
    const scrollHeight = isOnHomePage ? relevantAnchorScrollHeight + relevantAnchorScrollHeightHomePageAdjustment : relevantAnchorScrollHeight
    const rect = relevantAnchorsParents[relevantAnchorIndex].getBoundingClientRect()
    rootScrollContentElement?.scrollBy(0, rect.top - scrollHeight)
    relevantAnchors[relevantAnchorIndex].focus()
  }

  relevantAnchors.forEach((relevantAnchor, index) => {
    const abortController = new AbortController()
    relevantAnchor.addEventListener('focus', updateRelevantAnchorIndex(index), { signal: abortController.signal })
    updateRelevantAnchorsAborts.push(abortController)
  })

  return relevantAnchors
}

// const placeholders = document.querySelectorAll(`:not(.game-card) > :is(
//   .tw-card,
//   [class*="TowerPlaceholder"]
// )`)

let mutationObservers: MutationObserver[] = []
let lastMutationTimeout: ReturnType<typeof setTimeout>
const mutationWaitTimeMs = 100
function setupRelevantAnchorsMutations() {
  // .tw-tower elements have all the relevant anchors and anchors that can become visible later
  const twTowers = document.querySelectorAll<HTMLElement>('.tw-tower')

  mutationObservers.forEach((observer) => observer.disconnect())
  mutationObservers = []
  twTowers.forEach((tower) => {
    const mutationObserver = whenElementMutates(tower, (mutations, _observer) => {
      if (!tower.offsetParent) return

      let didAddNodes = false
      outer: for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          didAddNodes = true
          break outer
        }
      }
      if (!didAddNodes) return

      clearTimeout(lastMutationTimeout)
      lastMutationTimeout = setTimeout(() => {
        getRelevantAnchors()
      }, mutationWaitTimeMs)
    }, { childList: true })
    mutationObservers.push(mutationObserver)
  })
}

function updateRelevantAnchors() {
  const didPathChange = didPageHrefChange()
  const lastRelevantAnchorsLength = relevantAnchors.length
  const lastRelevantAnchorVisible = relevantAnchors[0]?.offsetParent
  if (!didPathChange && lastRelevantAnchorsLength !== 0 && lastRelevantAnchorVisible) return relevantAnchors.length
  // Bellow only runs if we need to setup new mutation observer

  const relevantAnchorsLength = getRelevantAnchors().length
  if (!relevantAnchorsLength) return relevantAnchorsLength

  isOnHomePage = document.querySelector<HTMLElement>('.home-header-sticky')

  relevantAnchorIndex = -1
  setupRelevantAnchorsMutations()

  return relevantAnchorsLength
}

category.shortcuts.set('focusNextRelevant', {
  defaultKey: ']',
  description: 'Focus next relevant',
  isAvailable: () => updateRelevantAnchors(),
  event: () => {
    const prevIndex = relevantAnchorIndex
    relevantAnchorIndex = Math.min(relevantAnchorIndex + 1, relevantAnchors.length - 1)
    if (relevantAnchorIndex === prevIndex) return
    scrollToAndFocusCurrentRelevantAnchor()
  }
})

category.shortcuts.set('focusPreviousRelevant', {
  defaultKey: '[',
  description: 'Focus previous relevant',
  isAvailable: () => updateRelevantAnchors(),
  event: () => {
    const prevIndex = relevantAnchorIndex
    relevantAnchorIndex = Math.max(relevantAnchorIndex - 1, 0)
    if (relevantAnchorIndex === prevIndex) return
    scrollToAndFocusCurrentRelevantAnchor()
  }
})

category.shortcuts.set('focusFirstRelevant', {
  defaultKey: '{',
  description: 'Focus first relevant',
  isAvailable: () => updateRelevantAnchors(),
  event: () => {
    if (relevantAnchorIndex === 0) return
    relevantAnchorIndex = 0
    scrollToAndFocusCurrentRelevantAnchor()
  }
})

category.shortcuts.set('focusLastRelevant', {
  defaultKey: '}',
  description: 'Focus last relevant',
  isAvailable: () => updateRelevantAnchors(),
  event: () => {
    if (relevantAnchorIndex === relevantAnchors.length - 1) return
    relevantAnchorIndex = relevantAnchors.length - 1
    scrollToAndFocusCurrentRelevantAnchor()
  }
})

category.shortcuts.set('showMoreViewAll', {
  defaultKey: '\\',
  description: 'Show more / all',
  isAvailable: () => showMoreRelevantButtons[relevantAnchorIndex],
  event: () => {
    showMoreRelevantButtons[relevantAnchorIndex].click()
  }
})

// TODO on home page, add shortcuts to press right/left arrows, or handle them somehow
