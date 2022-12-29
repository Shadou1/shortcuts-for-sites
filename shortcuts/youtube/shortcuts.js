let pathnameStartsWith, pathnameEndsWith, didHrefChange
let whenElementMutates, whenElementMutatesQuery
let didPageHrefChange
// TODO use bundler to import these functions with 'import {} from'
Promise.all([
  import(browser.runtime.getURL('utils/locationUtils.js')),
  import(browser.runtime.getURL('utils/mutationUtils.js')),
]).then(([locationUtils, mutationUtils]) => {
  ({ pathnameStartsWith, pathnameEndsWith, didHrefChange } = locationUtils);
  ({ whenElementMutates, whenElementMutatesQuery } = mutationUtils)
  didPageHrefChange = didHrefChange()
  // On document_idle
  updateVideoAnchors()
})

let goToVideosTab,
  goToPlaylistsTab,
  focusFirstPlaylist,
  goToHome,
  goToSubscriptions,
  expandAndFocusFirstSubscription,
  focusFirstSubscription
import(browser.runtime.getURL('shortcuts/youtube/utils.js')).then((result) => {
  ({
    goToVideosTab,
    goToPlaylistsTab,
    focusFirstPlaylist,
    goToHome,
    goToSubscriptions,
    expandAndFocusFirstSubscription,
    focusFirstSubscription
  } = result)
})

export const shortcuts = new Map()

let guideButton = null
let homeAnchor = null
let subscriptionsAnchor = null

shortcuts.set('expandGuideSidebar', {
  category: 'General',
  defaultKey: 'e',
  description: 'Expand/Collapse guide sidebar',
  event: () => {
    guideButton = guideButton || document.querySelector('ytd-masthead #guide-button #button')
    guideButton.click()
  }
})

// TODO CRITICAL conflicts with native 'captions: rotate through opacity levels'
shortcuts.set('goToHome', {
  category: 'General',
  defaultKey: 'o',
  description: 'Go to Home',
  event: () => {
    if (window.location.pathname === '/') return

    homeAnchor = homeAnchor || document.querySelector('#sections #endpoint[href="/"]')
    if (!homeAnchor) {
      guideButton = guideButton || document.querySelector('ytd-masthead #guide-button #button')
      guideButton.click()
      whenElementMutatesQuery('#content.ytd-app', goToHome)
    } else {
      homeAnchor.click()
    }
  }
})

shortcuts.set('goToSubscriptions', {
  category: 'General',
  defaultKey: 'u',
  description: 'Go to Subscriptions',
  event: () => {
    if (pathnameStartsWith('/subscriptions')) return

    subscriptionsAnchor = subscriptionsAnchor || document.querySelector('#sections #endpoint[href="/feed/subscriptions"]')
    if (!subscriptionsAnchor) {
      guideButton = guideButton || document.querySelector('ytd-masthead #guide-button #button')
      guideButton.click()
      whenElementMutatesQuery('#content.ytd-app', goToSubscriptions)
    } else {
      subscriptionsAnchor.click()
    }
  }
})

shortcuts.set('focusSubscribedChannels', {
  category: 'General',
  defaultKey: 'U',
  description: 'Focus subscribed channels',
  event: () => {
    guideButton = guideButton || document.querySelector('ytd-masthead #guide-button #button')
    if (guideButton.getAttribute('aria-pressed') === 'false' || guideButton.getAttribute('aria-pressed') === null) {
      guideButton.click()
      whenElementMutatesQuery('#content.ytd-app', expandAndFocusFirstSubscription)
    } else {
      focusFirstSubscription()
    }
  }
})

let videoAnchors = []
let videoAnchorsPanels = []
let videoAnchorIndex = -1

let videoAnchorsCommonParent
let mutationObserver
let mutationObserverOnResultsPage
let lastMutationTimeout
// TODO maybe this can be reduced
const mutationWaitTimeMs = 150
function setupVideoAnchorsMutations(isResultsPage) {
  // Find the common parent to watch for mutations on
  // This is the lowest common ancestor
  const firstElementParents = []
  let currentFirstElementParent = videoAnchorsPanels[0].parentElement
  while (currentFirstElementParent) {
    firstElementParents.unshift(currentFirstElementParent)
    currentFirstElementParent = currentFirstElementParent.parentElement
  }
  const lastElementParents = []
  let currentLastElementParent = videoAnchorsPanels[videoAnchors.length - 1].parentElement
  while (currentLastElementParent) {
    lastElementParents.unshift(currentLastElementParent)
    currentLastElementParent = currentLastElementParent.parentElement
  }

  let commonParent = lastElementParents[0]
  for (let i = 1; i < lastElementParents.length; i++) {
    if (firstElementParents[i] !== lastElementParents[i]) break
    commonParent = lastElementParents[i]
  }
  videoAnchorsCommonParent = commonParent

  // On /results pages, common parent is commonParent's parent's parent
  if (isResultsPage && videoAnchorsCommonParent.classList.contains('ytd-item-section-renderer')) {
    videoAnchorsCommonParent = videoAnchorsCommonParent.parentElement.parentElement
  }

  // If setting up new mutation observer, the last one should be disconnected
  mutationObserver?.disconnect()
  mutationObserver = whenElementMutates(videoAnchorsCommonParent, (_mutations, _observer) => {
    // If mutated anchors are no longer visible, return
    // The observer will later be disconnected by updateVideoAnchors()
    if (!videoAnchors[0]?.offsetParent) return
    // If mutation didn't add any new nodes, don't count it
    let didAddNodes = false
    outer: for (let mutation of _mutations) {
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
let lastMutationTimeoutNewResults
function setupVideoAnchorsMutationsOnResultsPage() {
  // Watch for mutation on the last section renderer contents div
  // New results will be added there, most time asynchronously
  const lastSectionContents = videoAnchorsCommonParent.querySelector('ytd-item-section-renderer:last-of-type > #contents')
  // If adding a new mutation observer on results page, the last on is not needed anymore
  mutationObserverOnResultsPage?.disconnect()
  mutationObserverOnResultsPage = whenElementMutates(lastSectionContents, (_mutations, observer) => {
    if (!lastSectionContents?.offsetParent) {
      // No need to watch for mutations on a now invisible element
      // If it later becomes visible, videoAnchors will already have all the results from it
      observer?.disconnect()
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

let updateVideoAnchorIndexAborts = []
function updateVideoAnchorIndex(toIndex) {
  return function () {
    videoAnchorIndex = toIndex
  }
}

function getVideoAnchors() {
  updateVideoAnchorIndexAborts.forEach((abortController) => abortController.abort())
  updateVideoAnchorIndexAborts = []

  videoAnchors = document.querySelectorAll(`ytd-page-manager > :not([hidden=""]) a:is(
.ytd-compact-video-renderer,
.ytd-compact-playlist-renderer,
.ytd-grid-video-renderer,
.ytd-grid-playlist-renderer,
.yt-simple-endpoint.ytd-playlist-renderer,
.yt-simple-endpoint.ytd-radio-renderer,
.yt-simple-endpoint.ytd-compact-radio-renderer,
#video-title,
#video-title-link
)`)
  // This query still sometimes queries invisible elements
  videoAnchors = [...videoAnchors.values()].filter((videoAnchor) => videoAnchor.offsetParent)

  videoAnchorsPanels = []
  videoAnchors.forEach((videoAnchor) => {
    let currentParent = videoAnchor
    for (let i = 0; i < 10; i++) {
      currentParent = currentParent.parentElement
      if (
        currentParent.id === 'dismissible' ||
        currentParent.tagName === 'YTD-GRID-PLAYLIST-RENDERER' ||
        currentParent.tagName === 'YTD-RADIO-RENDERER'
      ) break
    }
    videoAnchorsPanels.push(currentParent)
  })

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

// This needs to account for fixed headers, sometimes there are more than 1 fixed header (on the home page there are video categories header)
// TODO make this value dynamic
let videoAnchorPanelScrollHeight = 120
function scrollToVideoAnchorPanel(videoAnchorPanel) {
  const rect = videoAnchorPanel.getBoundingClientRect()
  window.scrollBy(0, rect.top - videoAnchorPanelScrollHeight)
}

shortcuts.set('focusNextVideo', {
  category: 'Videos',
  defaultKey: ']',
  description: 'Focus next video',
  isAvailable: () => updateVideoAnchors(),
  event: () => {
    const prevIndex = videoAnchorIndex
    videoAnchorIndex = Math.min(videoAnchorIndex + 1, videoAnchors.length - 1)
    if (videoAnchorIndex === prevIndex) return
    scrollToVideoAnchorPanel(videoAnchorsPanels[videoAnchorIndex])
    videoAnchors[videoAnchorIndex].focus()
  }
})

shortcuts.set('focusPreviousVideo', {
  category: 'Videos',
  defaultKey: '[',
  description: 'Focus previous video',
  isAvailable: () => updateVideoAnchors(),
  event: () => {
    const prevIndex = videoAnchorIndex
    videoAnchorIndex = Math.max(videoAnchorIndex - 1, 0)
    if (videoAnchorIndex === prevIndex) return
    scrollToVideoAnchorPanel(videoAnchorsPanels[videoAnchorIndex])
    videoAnchors[videoAnchorIndex].focus()
  }
})

shortcuts.set('focusFirstVideo', {
  category: 'Videos',
  defaultKey: '{',
  description: 'Focus first video',
  isAvailable: () => updateVideoAnchors(),
  event: () => {
    if (videoAnchorIndex === 0) return
    videoAnchorIndex = 0
    scrollToVideoAnchorPanel(videoAnchorsPanels[videoAnchorIndex])
    videoAnchors[videoAnchorIndex].focus()
  }
})

shortcuts.set('focusLastVideo', {
  category: 'Videos',
  defaultKey: '}',
  description: 'Focus last video',
  isAvailable: () => updateVideoAnchors(),
  event: () => {
    if (videoAnchorIndex === videoAnchors.length - 1) return
    videoAnchorIndex = videoAnchors.length - 1
    scrollToVideoAnchorPanel(videoAnchorsPanels[videoAnchorIndex])
    videoAnchors[videoAnchorIndex].focus()
  }
})

let moviePlayer = null // consistent
let settingsButton = null
let qualityButton = null

let moviePlayerChannel = null // constistent
let settingsButtonChannel = null
let qualityButtonChannel = null

shortcuts.set('openVideoSettings', {
  category: 'Video player',
  defaultKey: 's',
  description: 'Open settings',
  isAvailable: () => {
    if (pathnameStartsWith('/watch')) return true
    else if (pathnameStartsWith('/@', '/channel', '/c', '/user')) {
      moviePlayerChannel = moviePlayerChannel || document.querySelector('#c4-player')
      return moviePlayerChannel?.offsetParent
    }
  },
  event: () => {
    if (pathnameStartsWith('/watch')) {
      settingsButton = settingsButton || document.querySelector('#movie_player .ytp-settings-button')
      settingsButton?.click()
    }
    else if (pathnameStartsWith('/@', '/channel', '/c', '/user')) {
      settingsButtonChannel = settingsButtonChannel || document.querySelector('#c4-player .ytp-settings-button')
      settingsButtonChannel?.click()
    }
  }
})

shortcuts.set('openVideoQualitySettings', {
  category: 'Video player',
  defaultKey: 'q',
  description: 'Open quality settings',
  isAvailable: () => {
    if (pathnameStartsWith('/watch')) return true
    else if (pathnameStartsWith('/@', '/channel', '/c', '/user')) {
      moviePlayerChannel = moviePlayerChannel || document.querySelector('#c4-player')
      return moviePlayerChannel?.offsetParent
    }
  },
  event: () => {
    if (pathnameStartsWith('/watch')) {
      settingsButton = settingsButton || document.querySelector('#movie_player .ytp-settings-button')
      if (settingsButton.getAttribute('aria-expanded') === 'false') {
        settingsButton.click()
        qualityButton = qualityButton || document.querySelector('#movie_player .ytp-panel-menu .ytp-menuitem:last-child')
        qualityButton.click()
      } else {
        settingsButton.click()
      }
    }
    else if (pathnameStartsWith('/@', '/channel', '/c', '/user')) {
      settingsButtonChannel = settingsButtonChannel || document.querySelector('#c4-player .ytp-settings-button')
      if (settingsButtonChannel.getAttribute('aria-expanded') === 'false') {
        settingsButtonChannel.click()
        qualityButtonChannel = qualityButtonChannel || document.querySelector('#c4-player .ytp-panel-menu .ytp-menuitem:last-child')
        qualityButtonChannel.click()
      } else {
        settingsButtonChannel.click()
      }
    }
  }
})

shortcuts.set('focusVideoPlayer', {
  category: 'Video player',
  defaultKey: ';',
  description: 'Focus video player / show progress bar',
  isAvailable: () => {
    if (pathnameStartsWith('/watch')) return true
    else if (pathnameStartsWith('/@', '/channel', '/c', '/user')) {
      moviePlayerChannel = moviePlayerChannel || document.querySelector('#c4-player')
      return moviePlayerChannel?.offsetParent
    }
  },
  event: () => {
    if (pathnameStartsWith('/watch')) {
      moviePlayer = moviePlayer || document.querySelector('#movie_player')
      // TODO refactor
      moviePlayer.focus()
      moviePlayer.click()
      moviePlayer.click()
    }
    else if (pathnameStartsWith('/@', '/channel', '/c', '/user')) {
      moviePlayerChannel = moviePlayerChannel || document.querySelector('#c4-player')
      // TODO refactor
      moviePlayerChannel.focus()
      moviePlayerChannel.click()
      moviePlayerChannel.click()
    }
  }
})

let descriptionExpanded = false
shortcuts.set('scrollToVideoDescription', {
  category: 'Video player',
  defaultKey: 'd',
  description: 'Scroll to description/video',
  isAvailable: () => pathnameStartsWith('/watch'),
  event: () => {
    // TODO when clicking to fast, it stops working
    const infoRenderer = document.querySelector('#info ytd-video-primary-info-renderer, #above-the-fold')
    const showMoreButton = document.querySelector('.ytd-video-secondary-info-renderer tp-yt-paper-button#more, tp-yt-paper-button#expand')
    const showLessButton = document.querySelector('.ytd-video-secondary-info-renderer tp-yt-paper-button#less, tp-yt-paper-button#collapse')
    if (!descriptionExpanded) {
      infoRenderer.scrollIntoView()
      showMoreButton?.focus()
      showMoreButton?.click()
    } else {
      moviePlayer = moviePlayer || document.querySelector('#movie_player')
      showLessButton?.click()
      moviePlayer.focus()
      // window.scrollTo({ top: 0 })
    }
    descriptionExpanded = !descriptionExpanded
  }
})

shortcuts.set('focusCommentBox', {
  category: 'Video player',
  defaultKey: 'n',
  description: 'Comment',
  isAvailable: () => pathnameStartsWith('/watch'),
  event: () => {
    let commentBox = document.querySelector('ytd-comment-simplebox-renderer #placeholder-area')
    if (!commentBox) {

      const infoRenderer = document.querySelector('#info ytd-video-primary-info-renderer, #above-the-fold')
      infoRenderer.scrollIntoView()
      whenElementMutatesQuery('#content.ytd-app', (mutations, observer) => {
        commentBox = document.querySelector('ytd-comment-simplebox-renderer #placeholder-area')
        if (!commentBox) return

        observer.disconnect()
        commentBox.click()
      })

    } else {
      commentBox.click()
    }
  }
})

shortcuts.set('goToChannelHome', {
  category: 'Channel',
  defaultKey: 'h',
  description: 'Go to channel home',
  isAvailable: () => pathnameStartsWith('/watch', '/@', '/channel', '/c', '/user'),
  event: () => {
    if (pathnameStartsWith('/watch')) {
      const channelLink = document.querySelector('a.ytd-video-owner-renderer')
      channelLink.click()
    } else {
      // if (!pathnameEndsWith('/videos', '/shorts', '/streams', '/playlists', '/community', '/channels', '/about'))
      const homeTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-of-type(1)')
      homeTab.click()
    }
  }
})

shortcuts.set('goToChannelVideos', {
  category: 'Channel',
  defaultKey: 'v',
  description: 'Go to channel videos',
  isAvailable: () => pathnameStartsWith('/watch', '/@', '/channel', '/c', '/user'),
  event: () => {
    if (pathnameStartsWith('/watch')) {
      const channelLink = document.querySelector('a.ytd-video-owner-renderer')
      channelLink.click()
      whenElementMutatesQuery('#content.ytd-app', goToVideosTab)

    } else if (!pathnameEndsWith('/videos')) {
      // TODO refactor :nth-of-type(2)
      const videosTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-of-type(2)')
      videosTab.click()
    }
  }
})

shortcuts.set('goToChannelPlaylists', {
  category: 'Channel',
  defaultKey: 'p',
  description: 'Go to channel playlists',
  isAvailable: () => pathnameStartsWith('/watch', '/@', '/channel', '/c', '/user'),
  event: () => {
    if (pathnameStartsWith('/watch')) {
      const channelLink = document.querySelector('a.ytd-video-owner-renderer')
      channelLink.click()
      whenElementMutatesQuery('#content.ytd-app', goToPlaylistsTab)

    } else if (!pathnameEndsWith('/playlists')) {
      // TODO refactor :nth-last-of-type(5), this will incorrectly select another tab when channel has a 'store' tab, or doesn't have community tab
      const playlistsTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-last-of-type(5)')
      playlistsTab.click()
      whenElementMutatesQuery('#content.ytd-app', focusFirstPlaylist)
    }
  }
})

shortcuts.set('goToChannelNewTab', {
  category: 'Channel',
  defaultKey: 'H',
  description: 'Go to channel (new tab)',
  isAvailable: () => pathnameStartsWith('/watch'),
  event: () => {
    const channelLink = document.querySelector('a.ytd-video-owner-renderer')
    // TODO figure out why new tab opens with white background when using window.open
    // middle clicking on channel link opens new page with user's preferred color scheme
    window.open(channelLink.href, '_blank')
  }
})

let firstPlaylistVideo = null
let lastPlaylistVideo = null

shortcuts.set('focusFirstVideoInPlaylist', {
  category: 'Playlist',
  defaultKey: ',',
  description: 'Focus first video in playlist',
  isAvailable: () => {
    if (!pathnameStartsWith('/watch')) return false
    firstPlaylistVideo = firstPlaylistVideo?.offsetParent ? firstPlaylistVideo : document.querySelector('#content ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer#playlist-items a')
    return firstPlaylistVideo?.offsetParent
  },
  event: () => {
    firstPlaylistVideo.focus()
  }
})

shortcuts.set('focusLastVideoInPlaylist', {
  category: 'Playlist',
  defaultKey: '.',
  description: 'Focus last video in playlist',
  isAvailable: () => {
    if (!pathnameStartsWith('/watch')) return false
    lastPlaylistVideo = lastPlaylistVideo?.offsetParent ? lastPlaylistVideo : document.querySelector('#content ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer#playlist-items:last-of-type a')
    return lastPlaylistVideo?.offsetParent
  },
  event: () => {
    lastPlaylistVideo.focus()
  }
})

let hideChatButton = null
let chatIframe = null
let chatInputBox = null
let skipToLiveBroadcastButton = null

shortcuts.set('hideChat', {
  category: 'Premiere/Stream',
  defaultKey: 'E',
  description: 'Hide/Show chat',
  isAvailable: () => {
    if (!pathnameStartsWith('/watch')) return false
    hideChatButton = hideChatButton?.offsetParent ? hideChatButton : document.querySelector('ytd-app ytd-live-chat-frame #show-hide-button button')
    return hideChatButton?.offsetParent
  },
  event: () => {
    hideChatButton.click()
  }
})

shortcuts.set('focusChatBox', {
  category: 'Premiere/Stream',
  defaultKey: 'b',
  description: 'Chat',
  isAvailable: () => {
    if (!pathnameStartsWith('/watch')) return false
    chatIframe = chatIframe?.offsetParent ? chatIframe : document.querySelector('iframe#chatframe')
    if (!chatIframe) return false
    chatInputBox = chatInputBox?.offsetParent ? chatInputBox : chatIframe?.contentDocument?.querySelector('yt-live-chat-app yt-live-chat-text-input-field-renderer #input')
    return chatInputBox?.offsetParent
  },
  event: () => {
    chatInputBox.focus()
  }
})

shortcuts.set('skipToLiveBroadcast', {
  category: 'Premiere/Stream',
  defaultKey: 'S',
  description: 'Skip ahead to live broadcast',
  isAvailable: () => {
    if (!pathnameStartsWith('/watch')) return false
    skipToLiveBroadcastButton = skipToLiveBroadcastButton?.offsetParent ? skipToLiveBroadcastButton : document.querySelector('#movie_player .ytp-left-controls button.ytp-live-badge')
    return skipToLiveBroadcastButton?.offsetParent
  },
  event: () => {
    skipToLiveBroadcastButton.click()
  }
})
