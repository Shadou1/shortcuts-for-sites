import { getSetupUpdateIndexOnFocus } from '../../utils/focusUtils'
import { getChangeIndex } from '../../utils/indexUtils'
import { didHrefChange } from '../../utils/locationUtils'
import { findCommonParent, getSetupMutations } from '../../utils/mutationUtils'
import { ShortcutsCategory } from '../Shortcuts'

const didPageHrefChange = didHrefChange()

const category = new ShortcutsCategory('Videos', 'Videos')
export default category

let videoAnchors: HTMLAnchorElement[] = []
let videoAnchorsPanels: HTMLElement[] = []
let videoAnchorIndex = -1
let changeVideoAnchorIndex: ReturnType<typeof getChangeIndex>

// This needs to account for fixed headers, sometimes there are more than 1 fixed header (on the home page there are video categories header)
// TODO make this value dynamic
const videoAnchorPanelScrollHeight = 120
let scrollToAndFocusCurrentVideoAnchor: () => void

const setupUpdateVideoAnchorIndexOnFocus = getSetupUpdateIndexOnFocus((index) => videoAnchorIndex = index)

function getVideoAnchors() {
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
    const rect = videoAnchorsPanels[videoAnchorIndex].getBoundingClientRect()
    window.scrollBy(0, rect.top - videoAnchorPanelScrollHeight)
    videoAnchors[videoAnchorIndex].focus()
  }

  changeVideoAnchorIndex = getChangeIndex(videoAnchors)

  setupUpdateVideoAnchorIndexOnFocus(videoAnchors)

  return videoAnchors
}

let videoAnchorsCommonParent: HTMLElement
let isResultsPage: boolean

const [setupVideoAnchorsMutationsOnResultsPage] = getSetupMutations(getVideoAnchors, {
  mutationWaitTimeMs: 150,
  beforeMutation: (commonParent, _mutations, observer) => {
    if (!commonParent.offsetParent) {
      observer.disconnect()
      return true
    }
    return false
  }
})

const [setupVideoAnchorsMutations] = getSetupMutations(() => {
  if (isResultsPage) {
    const lastSectionContents = videoAnchorsCommonParent.querySelector<HTMLElement>('ytd-item-section-renderer:last-of-type > #contents')!
    setupVideoAnchorsMutationsOnResultsPage(lastSectionContents)
  }
  return getVideoAnchors()
}, {
  mutationWaitTimeMs: 150,
  beforeMutation: () => !videoAnchors[0]?.offsetParent,
})

function updateVideoAnchors() {
  const didPathChange = didPageHrefChange()
  const lastVideoAnchorsLength = videoAnchors.length
  const lastVideoAnchorVisible = videoAnchors[0]?.offsetParent
  if (!didPathChange && lastVideoAnchorsLength !== 0 && lastVideoAnchorVisible) return videoAnchors.length
  // Bellow only runs if we need to setup new mutation observer

  const videoAnchorsLength = getVideoAnchors().length
  if (videoAnchorsLength < 2) return videoAnchorsLength

  videoAnchorIndex = -1

  isResultsPage = window.location.pathname === '/results'
  videoAnchorsCommonParent = findCommonParent(videoAnchorsPanels[0], videoAnchorsPanels[videoAnchorsPanels.length - 1])
  // On /results pages, common parent is commonParent's parent's parent
  if (isResultsPage && videoAnchorsCommonParent.classList.contains('ytd-item-section-renderer')) {
    videoAnchorsCommonParent = videoAnchorsCommonParent.parentElement!.parentElement!
  }

  setupVideoAnchorsMutations(videoAnchorsCommonParent)
  if (isResultsPage) {
    // Only for initial results, not all of them may be loaded yet
    const lastSectionContents = videoAnchorsCommonParent.querySelector<HTMLElement>('ytd-item-section-renderer:last-of-type > #contents')!
    setupVideoAnchorsMutationsOnResultsPage(lastSectionContents)
  }

  return videoAnchorsLength
}

// On document_idle
// Rarely, on document_idle not all anchors are loaded yet (for pages other than /results)
// So just let user update video anchors when they use a corresponding shortcut
// This way tabbing to anchors and then using a shortcut will reset anchor index to 0,
// updateVideoAnchors()

function focusVideoAnchor(which: Parameters<typeof changeVideoAnchorIndex>[0]) {
  const prevIndex = videoAnchorIndex
  videoAnchorIndex = changeVideoAnchorIndex(which, videoAnchorIndex)
  if (videoAnchorIndex === prevIndex) return
  scrollToAndFocusCurrentVideoAnchor()
}

category.shortcuts.set('focusNextVideo', {
  defaultKey: ']',
  description: 'Focus next video',
  isAvailable: updateVideoAnchors,
  event: () => {
    focusVideoAnchor('next')
  }
})

category.shortcuts.set('focusPreviousVideo', {
  defaultKey: '[',
  description: 'Focus previous video',
  isAvailable: updateVideoAnchors,
  event: () => {
    focusVideoAnchor('previous')
  }
})

category.shortcuts.set('focusFirstVideo', {
  defaultKey: '{',
  description: 'Focus first video',
  isAvailable: updateVideoAnchors,
  event: () => {
    focusVideoAnchor('first')
  }
})

category.shortcuts.set('focusLastVideo', {
  defaultKey: '}',
  description: 'Focus last video',
  isAvailable: updateVideoAnchors,
  event: () => {
    focusVideoAnchor('last')
  }
})
