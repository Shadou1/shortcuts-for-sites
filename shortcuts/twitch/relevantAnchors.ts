import { getSetupUpdateIndexOnFocus } from '../../utils/focusUtils'
import { getChangeIndex } from '../../utils/indexUtils'
import { didHrefChange } from '../../utils/locationUtils'
import { getSetupMutations } from '../../utils/mutationUtils'
import { ShortcutsCategory } from '../Shortcuts'

const didPageHrefChange = didHrefChange()

const category = new ShortcutsCategory('Relevant content (stream, video...)', 'Relevant anchors')
export default category

let relevantAnchors: HTMLAnchorElement[] = []
let showMoreRelevantButtons: HTMLButtonElement[] = []
let relevantAnchorIndex = -1
let changeRelevantAnchorIndex: ReturnType<typeof getChangeIndex>

const relevantAnchorScrollHeight = 120
const relevantAnchorScrollHeightHomePageAdjustment = 100
let scrollToAndFocusCurrentRelevantAnchor: () => void

const setupUpdateRelevantAnchorIndexOnFocus = getSetupUpdateIndexOnFocus((index) => relevantAnchorIndex = index)

// TODO add channel anchors to a list of relevant anchors
// Should get streams, videos, clips, categories
function getRelevantAnchors() {
  const twTowersAndShowMoreButtons = document.querySelectorAll(':is([data-test-selector="view-all"], .tw-tower, .show-more__move-up :is(button, a))')

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
    } else if (twTowersAndShowMoreButtons[i + 1]?.tagName === 'BUTTON' || twTowersAndShowMoreButtons[i + 1]?.tagName === 'A') {
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
    const isOnHomePage = document.querySelector<HTMLElement>('.home-header-sticky')
    const scrollHeight = isOnHomePage ? relevantAnchorScrollHeight + relevantAnchorScrollHeightHomePageAdjustment : relevantAnchorScrollHeight
    const rect = relevantAnchorsParents[relevantAnchorIndex].getBoundingClientRect()
    rootScrollContentElement?.scrollBy(0, rect.top - scrollHeight)
    relevantAnchors[relevantAnchorIndex].focus()
  }

  changeRelevantAnchorIndex = getChangeIndex(relevantAnchors)

  setupUpdateRelevantAnchorIndexOnFocus(relevantAnchors)

  return relevantAnchors
}

// const placeholders = document.querySelectorAll(`:not(.game-card) > :is(
//   .tw-card,
//   [class*="TowerPlaceholder"]
// )`)

const [setupRelevantAnchorsMutations, disconnectRelevantAnchorsObservers] = getSetupMutations(getRelevantAnchors, {
  mutationWaitTimeMs: 100,
  beforeMutation: (commonParent) => !commonParent.offsetParent,
  setupMultipleObservers: true
})

function updateRelevantAnchors() {
  const didPathChange = didPageHrefChange()
  const lastRelevantAnchorsLength = relevantAnchors.length
  const lastRelevantAnchorVisible = relevantAnchors[0]?.offsetParent
  if (!didPathChange && lastRelevantAnchorsLength !== 0 && lastRelevantAnchorVisible) return relevantAnchors.length
  // Bellow only runs if we need to setup new mutation observer

  const relevantAnchorsLength = getRelevantAnchors().length
  if (relevantAnchorsLength < 2) return relevantAnchorsLength

  relevantAnchorIndex = -1
  disconnectRelevantAnchorsObservers()
  // .tw-tower elements have all the relevant anchors and anchors that can become visible later
  const twTowers = document.querySelectorAll<HTMLElement>('.tw-tower')
  twTowers.forEach((tower) => {
    setupRelevantAnchorsMutations(tower)
  })

  return relevantAnchorsLength
}

function focusRelevantAnchor(which: Parameters<typeof changeRelevantAnchorIndex>[0]) {
  const prevIndex = relevantAnchorIndex
  relevantAnchorIndex = changeRelevantAnchorIndex(which, relevantAnchorIndex)
  if (relevantAnchorIndex === prevIndex) return
  scrollToAndFocusCurrentRelevantAnchor()
}

category.shortcuts.set('focusNextRelevant', {
  defaultKey: ']',
  description: 'Focus next relevant',
  isAvailable: updateRelevantAnchors,
  event: () => {
    focusRelevantAnchor('next')
  }
})

category.shortcuts.set('focusPreviousRelevant', {
  defaultKey: '[',
  description: 'Focus previous relevant',
  isAvailable: updateRelevantAnchors,
  event: () => {
    focusRelevantAnchor('previous')
  }
})

category.shortcuts.set('focusFirstRelevant', {
  defaultKey: '{',
  description: 'Focus first relevant',
  isAvailable: updateRelevantAnchors,
  event: () => {
    focusRelevantAnchor('first')
  }
})

category.shortcuts.set('focusLastRelevant', {
  defaultKey: '}',
  description: 'Focus last relevant',
  isAvailable: updateRelevantAnchors,
  event: () => {
    focusRelevantAnchor('last')
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
