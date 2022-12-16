let guideButton = null
let homeAnchor = null
let subscriptionsAnchor = null
let settingsButton = null
let settingsButtonChannel = null
let qualityButton = null
let qualityButtonChannel = null
let moviePlayer = null

// TODO use bundler to import these functions with 'import {} from'
let pathnameStartsWith, pathnameEndsWith
import(browser.runtime.getURL('utils/locationUtils.js')).then((result) => {
  ({ pathnameStartsWith, pathnameEndsWith } = result)
})

let whenTargetMutates
import(browser.runtime.getURL('utils/mutationUtils.js')).then((result) => {
  ({ whenTargetMutates } = result)
})

let navigateToHome,
  navigateToVideos,
  navigateToPlaylists,
  focusFirstVideo,
  focusFirstVideoOn,
  focusFirstVideoOnQueryType,
  focusFirstPlaylist,
  goToHome,
  goToSubscriptions,
  expandAndFocusFirstSubscription,
  focusFirstSubscription
import(browser.runtime.getURL('shortcuts/youtube/utils.js')).then((result) => {
  ({
    navigateToHome,
    navigateToVideos,
    navigateToPlaylists,
    focusFirstVideo,
    focusFirstVideoOn,
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
  event: () => {
    if (pathnameStartsWith('/watch')) {
      settingsButton = settingsButton || document.querySelector('#movie_player .ytp-settings-button')
      settingsButton?.click()
    }
    if (pathnameStartsWith('/@', '/channel', '/c', '/user')) {
      settingsButtonChannel = settingsButtonChannel || document.querySelector('#c4-player .ytp-settings-button')
      settingsButtonChannel?.click()
    }
  }
})

shortcuts.set('openVideoQualitySettings', {
  category: 'Video',
  defaultKey: 'q',
  description: 'Open quality settings',
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
    if (pathnameStartsWith('/@', '/channel', '/c', '/user')) {
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
  event: () => {
    if (!pathnameStartsWith('/watch')) return

    moviePlayer = moviePlayer || document.querySelector('#movie_player')
    // TODO refactor
    moviePlayer.focus()
    moviePlayer.click()
    moviePlayer.click()
  }
})

shortcuts.set('scrollToVideoDescription', {
  category: 'Video',
  defaultKey: 'd',
  description: 'Scroll to description/video',
  event: () => {
    if (!pathnameStartsWith('/watch')) return

    const infoRenderer = document.querySelector('#info ytd-video-primary-info-renderer, #above-the-fold')
    const showMoreButton = document.querySelector('.ytd-video-secondary-info-renderer tp-yt-paper-button#more, tp-yt-paper-button#expand')
    const showLessButton = document.querySelector('.ytd-video-secondary-info-renderer tp-yt-paper-button#less, tp-yt-paper-button#collapse')
    if (!showMoreButton.hidden) {
      showMoreButton.focus()
      infoRenderer.scrollIntoView()
      showMoreButton.click()
    } else {
      const video = document.querySelector('video')
      video.focus()
      showLessButton.click()
      window.scrollTo({ top: 0 })
    }
  }
})

shortcuts.set('focusFirstRelatedVideo', {
  category: 'Video',
  defaultKey: 'r',
  description: 'Focus first related video',
  event: () => {
    if (!pathnameStartsWith('/watch')) return

    const relatedLink = document.querySelector('#related a.yt-simple-endpoint.style-scope.ytd-compact-video-renderer')
    relatedLink.focus()
  }
})

shortcuts.set('focusCommentBox', {
  category: 'Video',
  defaultKey: 'n',
  description: 'Comment',
  event: () => {
    if (!pathnameStartsWith('/watch')) return

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
  event: () => {
    if (!pathnameStartsWith('/watch')) return

    const firstPlaylistVideo = document.querySelector('#content ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer#playlist-items a')
    firstPlaylistVideo.focus()
  }
})

shortcuts.set('focusLastVideoInPlaylist', {
  category: 'Playlist',
  defaultKey: ']',
  description: 'Focus last video in playlist',
  event: () => {
    if (!pathnameStartsWith('/watch')) return

    const firstPlaylistVideo = document.querySelector('#content ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer#playlist-items:last-of-type a')
    firstPlaylistVideo.focus()
  }
})

shortcuts.set('goToChannelHome', {
  category: 'Channel (works on channel or video page)',
  defaultKey: 'h',
  description: 'Go to channel home',
  event: () => {
    if (!pathnameStartsWith('/watch', '/@', '/channel', '/c', '/user')) return

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
  category: 'Channel (works on channel or video page)',
  defaultKey: 'v',
  description: 'Go to channel videos',
  event: () => {
    if (!pathnameStartsWith('/watch', '/@', '/channel', '/c', '/user')) return

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
  category: 'Channel (works on channel or video page)',
  defaultKey: 'p',
  description: 'Go to channel playlists',
  event: () => {
    if (!pathnameStartsWith('/watch', '/@', '/channel', '/c', '/user')) return

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
  category: 'Channel (works on channel or video page)',
  defaultKey: 'H',
  description: 'Go to channel (new tab)',
  event: () => {
    if (!pathnameStartsWith('/watch')) return

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
  event: () => {
    if (!pathnameStartsWith('/watch')) return

    const hideChatButton = document.querySelector('ytd-app ytd-live-chat-frame #show-hide-button button')
    hideChatButton?.click()
  }
})

shortcuts.set('focusChatBox', {
  category: 'Premiere/Stream',
  defaultKey: 'b',
  description: 'Chat',
  event: () => {
    if (!pathnameStartsWith('/watch')) return

    const chatIframe = document.querySelector('iframe#chatframe')
    const chatBox = chatIframe.contentDocument.querySelector('yt-live-chat-app yt-live-chat-text-input-field-renderer #input')
    chatBox?.focus()
  }
})

shortcuts.set('skipToLiveBroadcast', {
  category: 'Premiere/Stream',
  defaultKey: 'S',
  description: 'Skip ahead to live broadcast',
  event: () => {
    if (!pathnameStartsWith('/watch')) return

    const skipButton = document.querySelector('#movie_player .ytp-left-controls button.ytp-live-badge')
    skipButton?.click()
  }
})
