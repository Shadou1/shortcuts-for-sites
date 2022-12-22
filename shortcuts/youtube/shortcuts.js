let guideButton = null
let homeAnchor = null
let subscriptionsAnchor = null

let moviePlayer = null // consistent
let settingsButton = null
let qualityButton = null

let moviePlayerChannel = null // constistent
let settingsButtonChannel = null
let qualityButtonChannel = null

let firstPlaylistVideo = null
let lastPlaylistVideo = null

let hideChatButton = null
let chatIframe = null
let chatInputBox = null
let skipToLiveBroadcastButton = null

// TODO use bundler to import these functions with 'import {} from'
let pathnameStartsWith, pathnameEndsWith
import(browser.runtime.getURL('utils/locationUtils.js')).then((result) => {
  ({ pathnameStartsWith, pathnameEndsWith } = result)
})

let whenTargetMutates
import(browser.runtime.getURL('utils/mutationUtils.js')).then((result) => {
  ({ whenTargetMutates } = result)
})

let navigateToVideos,
  navigateToPlaylists,
  focusFirstVideo,
  focusFirstVideoOnQueryType,
  focusFirstPlaylist,
  goToHome,
  goToSubscriptions,
  expandAndFocusFirstSubscription,
  focusFirstSubscription
import(browser.runtime.getURL('shortcuts/youtube/utils.js')).then((result) => {
  ({
    navigateToVideos,
    navigateToPlaylists,
    focusFirstVideo,
    focusFirstVideoOnQueryType,
    focusFirstPlaylist,
    goToHome,
    goToSubscriptions,
    expandAndFocusFirstSubscription,
    focusFirstSubscription
  } = result)
})

export const shortcuts = new Map()

shortcuts.set('expandGuideSidebar', {
  category: 'General',
  defaultKey: 'e',
  description: 'Expand/Collapse guide sidebar',
  event: () => {
    guideButton = guideButton || document.querySelector('ytd-masthead #guide-button #button')
    guideButton.click()
  }
})

shortcuts.set('goToHome', {
  category: 'General',
  defaultKey: 'o',
  description: 'Go to Home',
  event: () => {
    if (window.location.pathname !== '/') {
      homeAnchor = homeAnchor || document.querySelector('#sections #endpoint[href="/"]')
      if (!homeAnchor) {
        guideButton = guideButton || document.querySelector('ytd-masthead #guide-button #button')
        guideButton.click()
        whenTargetMutates('#content.ytd-app', goToHome)
      } else {
        homeAnchor.click()
        whenTargetMutates('#content.ytd-app', focusFirstVideoOnQueryType(1))
      }
    } else {
      focusFirstVideo()
    }
  }
})

shortcuts.set('goToSubscriptions', {
  category: 'General',
  defaultKey: 'u',
  description: 'Go to Subscriptions',
  event: () => {
    if (!pathnameEndsWith('/subscriptions')) {
      subscriptionsAnchor = subscriptionsAnchor || document.querySelector('#sections #endpoint[href="/feed/subscriptions"]')
      if (!subscriptionsAnchor) {
        guideButton = guideButton || document.querySelector('ytd-masthead #guide-button #button')
        guideButton.click()
        whenTargetMutates('#content.ytd-app', goToSubscriptions)
      } else {
        subscriptionsAnchor.click()
        whenTargetMutates('#content.ytd-app', focusFirstVideoOnQueryType(2))
      }
    } else {
      focusFirstVideo()
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
      whenTargetMutates('#content.ytd-app', expandAndFocusFirstSubscription)
    } else {
      focusFirstSubscription()
    }
  }
})

shortcuts.set('openVideoSettings', {
  category: 'Video',
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
  category: 'Video',
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

shortcuts.set('focusVideo', {
  category: 'Video',
  defaultKey: ';',
  description: 'Focus video / show progress bar',
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
  category: 'Video',
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

shortcuts.set('focusFirstRelatedVideo', {
  category: 'Video',
  defaultKey: 'r',
  description: 'Focus first related video',
  isAvailable: () => pathnameStartsWith('/watch'),
  event: () => {
    const relatedLink = document.querySelector('#related a.yt-simple-endpoint.style-scope.ytd-compact-video-renderer')
    relatedLink.focus()
  }
})

shortcuts.set('focusCommentBox', {
  category: 'Video',
  defaultKey: 'n',
  description: 'Comment',
  isAvailable: () => pathnameStartsWith('/watch'),
  event: () => {
    let commentBox = document.querySelector('ytd-comment-simplebox-renderer #placeholder-area')
    if (!commentBox) {

      const infoRenderer = document.querySelector('#info ytd-video-primary-info-renderer, #above-the-fold')
      infoRenderer.scrollIntoView()
      whenTargetMutates('#content.ytd-app', (mutations, observer) => {
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

shortcuts.set('focusFirstVideoInPlaylist', {
  category: 'Playlist',
  defaultKey: '[',
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
  defaultKey: ']',
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

shortcuts.set('goToChannelHome', {
  category: 'Channel',
  defaultKey: 'h',
  description: 'Go to channel home',
  isAvailable: () => pathnameStartsWith('/watch', '/@', '/channel', '/c', '/user'),
  event: () => {
    if (pathnameStartsWith('/watch')) {
      const channelLink = document.querySelector('a.ytd-video-owner-renderer')
      channelLink.click()
      // whenTargetMutates('#content.ytd-app', navigateToHome)
      whenTargetMutates('#content.ytd-app', focusFirstVideoOnQueryType(3))

    } else {
      if (!pathnameEndsWith('/videos', '/shorts', '/streams', '/playlists', '/community', '/channels', '/about')) {
        // focusFirstVideo()
        focusFirstVideoOnQueryType(3)()
      } else {
        const homeTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-of-type(1)')
        homeTab.click()
        whenTargetMutates('#content.ytd-app', focusFirstVideoOnQueryType(3))
      }
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
      whenTargetMutates('#content.ytd-app', navigateToVideos)

    } else {
      if (pathnameEndsWith('/videos')) {
        focusFirstVideo()
      } else {
        // TODO refactor :nth-of-type(2)
        const videosTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-of-type(2)')
        videosTab.click()
        whenTargetMutates('#content.ytd-app', focusFirstVideoOnQueryType(1))
      }
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
      whenTargetMutates('#content.ytd-app', navigateToPlaylists)

    } else {
      if (pathnameEndsWith('/playlists')) {
        focusFirstPlaylist()
      } else {
        // TODO refactor :nth-last-of-type(5), this will incorrectly select another tab when channel has a 'store' tab, or doesn't have community tab
        const playlistsTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-last-of-type(5)')
        playlistsTab.click()
        whenTargetMutates('#content.ytd-app', focusFirstPlaylist)
      }
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
    chatInputBox = chatInputBox?.offsetParent ? chatInputBox : chatIframe.contentDocument.querySelector('yt-live-chat-app yt-live-chat-text-input-field-renderer #input')
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
