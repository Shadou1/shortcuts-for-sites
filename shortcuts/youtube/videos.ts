import { didHrefChange } from '../../utils/locationUtils'
import { findCommonParent, whenElementMutates } from '../../utils/mutationUtils'
import { ShortcutsCategory } from '../Shortcuts'

const didPageHrefChange = didHrefChange()

const category = new ShortcutsCategory('Videos', 'Videos')
export default category

let videoAnchors: HTMLAnchorElement[] = []
let videoAnchorsPanels: HTMLElement[] = []
let videoAnchorIndex = -1
// This needs to account for fixed headers, sometimes there are more than 1 fixed header (on the home page there are video categories header)
// TODO make this value dynamic
const videoAnchorPanelScrollHeight = 120
let scrollToAndFocusCurrentVideoAnchor: () => void

let videoAnchorsCommonParent: HTMLElement
let mutationObserver: MutationObserver | null
let mutationObserverOnResultsPage: MutationObserver | null
let lastMutationTimeout: ReturnType<typeof setTimeout>

// TODO maybe this can be reduced
const mutationWaitTimeMs = 150
function setupVideoAnchorsMutations(isResultsPage: boolean) {
  videoAnchorsCommonParent = findCommonParent(videoAnchorsPanels[0], videoAnchorsPanels[videoAnchors.length - 1])

  // On /results pages, common parent is commonParent's parent's parent
  if (isResultsPage && videoAnchorsCommonParent.classList.contains('ytd-item-section-renderer')) {
    videoAnchorsCommonParent = videoAnchorsCommonParent.parentElement!.parentElement!
  }

  // console.log('common parent', videoAnchorsCommonParent)

  // If setting up new mutation observer, the last one should be disconnected
  mutationObserver?.disconnect()
  mutationObserver = whenElementMutates(videoAnchorsCommonParent, (mutations, _observer) => {
    // If mutated anchors are no longer visible, return
    // The observer will later be disconnected by updateVideoAnchors()
    if (!videoAnchors[0]?.offsetParent) return
    // If mutation didn't add any new nodes, don't count it
    let didAddNodes = false
    outer: for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        didAddNodes = true
        break outer
      }
    }
    if (!didAddNodes) return

    // Wait for mutationWaitTimeMs, there may be a series of mutations in a row
    clearTimeout(lastMutationTimeout)
    lastMutationTimeout = setTimeout(() => {
      getVideoAnchors()
      // If on results page, setup mutation observer for the newely added elements
      if (isResultsPage) {
        setupVideoAnchorsMutationsOnResultsPage()
      }
    }, mutationWaitTimeMs)
  }, { childList: true })
}

// TODO maybe other pages also need this functionality
let lastMutationTimeoutNewResults: ReturnType<typeof setTimeout>
function setupVideoAnchorsMutationsOnResultsPage() {
  // Watch for mutation on the last section renderer contents div
  // New results will be added there, most time asynchronously
  const lastSectionContents = videoAnchorsCommonParent.querySelector<HTMLElement>('ytd-item-section-renderer:last-of-type > #contents')!
  // If adding a new mutation observer on results page, the last on is not needed anymore
  mutationObserverOnResultsPage?.disconnect()
  mutationObserverOnResultsPage = whenElementMutates(lastSectionContents, (_mutations, observer) => {
    if (!lastSectionContents.offsetParent) {
      // No need to watch for mutations on a now invisible element
      // If it later becomes visible, videoAnchors will already have all the results from it
      observer.disconnect()
      return
    }
    clearTimeout(lastMutationTimeoutNewResults)
    lastMutationTimeoutNewResults = setTimeout(() => {
      getVideoAnchors()
      // If this gets called, there will be no future results, so it's ok to disconnect the observer
      // However, disconnecting the observer may lead to errors:
      // If time between new results mutations is greater than mutationWaitTimeMs, videoAnchors will not contain the latest results
      // This can be fixed by not disconnecting the observer
      // There is no overehead (probably)
      // observer.disconnect()
    }, mutationWaitTimeMs)
  }, { childList: true })
}

let updateVideoAnchorIndexAborts: AbortController[] = []
function updateVideoAnchorIndex(toIndex: number) {
  return function () {
    videoAnchorIndex = toIndex
  }
}

function getVideoAnchors() {
  updateVideoAnchorIndexAborts.forEach((abortController) => abortController.abort())
  updateVideoAnchorIndexAborts = []

  videoAnchors = [...document.querySelectorAll<HTMLAnchorElement>(`ytd-page-manager > :not([hidden=""]) a:is(
    .ytd-compact-video-renderer,
    .ytd-compact-playlist-renderer,
    .ytd-grid-video-renderer,
    .ytd-grid-playlist-renderer,
    .yt-simple-endpoint.ytd-playlist-renderer,
    .yt-simple-endpoint.ytd-radio-renderer,
    .yt-simple-endpoint.ytd-compact-radio-renderer,
    #video-title,
    #video-title-link
  )`)]
  // This query still sometimes queries invisible elements
  videoAnchors = videoAnchors.filter((videoAnchor) => videoAnchor.offsetParent)

  videoAnchorsPanels = []
  videoAnchors.forEach((videoAnchor) => {
    const videoAnchorPanel = videoAnchor.closest<HTMLElement>(`:is(
      #dismissible,
      ytd-grid-playlist-renderer,
      ytd-playlist-renderer,
      ytd-radio-renderer
    )`)!
    videoAnchorsPanels.push(videoAnchorPanel)
  })

  scrollToAndFocusCurrentVideoAnchor = () => {
    videoAnchorsPanels[videoAnchorIndex]
    const rect = videoAnchorsPanels[videoAnchorIndex].getBoundingClientRect()
    window.scrollBy(0, rect.top - videoAnchorPanelScrollHeight)
    videoAnchors[videoAnchorIndex].focus()
  }

  videoAnchors.forEach((videoAnchor, index) => {
    const abortController = new AbortController()
    videoAnchor.addEventListener('focus', updateVideoAnchorIndex(index), { signal: abortController.signal })
    updateVideoAnchorIndexAborts.push(abortController)
  })

  return videoAnchors
}

function updateVideoAnchors() {
  const didPathChange = didPageHrefChange()
  const lastVideoAnchorsLength = videoAnchors.length
  const lastVideoAnchorVisible = videoAnchors[0]?.offsetParent
  if (!didPathChange && lastVideoAnchorsLength !== 0 && lastVideoAnchorVisible) return videoAnchors.length
  // Bellow only runs if we need to setup new mutation observer

  const videoAnchorsLength = getVideoAnchors().length
  if (!videoAnchorsLength) return videoAnchorsLength

  videoAnchorIndex = -1
  const isResultsPage = window.location.pathname === '/results'
  setupVideoAnchorsMutations(isResultsPage)
  if (isResultsPage) {
    // Only for initial results, not all of them may be loaded yet
    setupVideoAnchorsMutationsOnResultsPage()
  }

  return videoAnchorsLength
}

// On document_idle
// Rarely, on document_idle not all anchors are loaded yet (for pages other than /results)
// So just let user update video anchors when they use a corresponding shortcut
// This way tabbing to anchors and then using a shortcut will reset anchor index to 0,
// updateVideoAnchors()

category.shortcuts.set('focusNextVideo', {
  defaultKey: ']',
  description: 'Focus next video',
  isAvailable: () => updateVideoAnchors(),
  event: () => {
    const prevIndex = videoAnchorIndex
    videoAnchorIndex = Math.min(videoAnchorIndex + 1, videoAnchors.length - 1)
    if (videoAnchorIndex === prevIndex) return
    scrollToAndFocusCurrentVideoAnchor()
  }
})

category.shortcuts.set('focusPreviousVideo', {
  defaultKey: '[',
  description: 'Focus previous video',
  isAvailable: () => updateVideoAnchors(),
  event: () => {
    const prevIndex = videoAnchorIndex
    videoAnchorIndex = Math.max(videoAnchorIndex - 1, 0)
    if (videoAnchorIndex === prevIndex) return
    scrollToAndFocusCurrentVideoAnchor()
  }
})

category.shortcuts.set('focusFirstVideo', {
  defaultKey: '{',
  description: 'Focus first video',
  isAvailable: () => updateVideoAnchors(),
  event: () => {
    if (videoAnchorIndex === 0) return
    videoAnchorIndex = 0
    scrollToAndFocusCurrentVideoAnchor()
  }
})

category.shortcuts.set('focusLastVideo', {
  defaultKey: '}',
  description: 'Focus last video',
  isAvailable: () => updateVideoAnchors(),
  event: () => {
    if (videoAnchorIndex === videoAnchors.length - 1) return
    videoAnchorIndex = videoAnchors.length - 1
    scrollToAndFocusCurrentVideoAnchor()
  }
})
