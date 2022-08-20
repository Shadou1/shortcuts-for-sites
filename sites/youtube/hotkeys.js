let guideButton = null
let homeAnchor = null
let subscriptionsAnchor = null
let settingsButton = null
let qualityButton = null
let moviePlayer = null
let showMoreSubscriptionsAnchor = null

// TODO use bundler to import these functions with 'import {} from'
let locationStartsWith, locationEndsWith;
(async () => {
  ({ locationStartsWith, locationEndsWith } = await import(browser.runtime.getURL('utils/locationUtils.js')))
})()

let whenTargetMutates;
(async () => {
  ({ whenTargetMutates } = await import(browser.runtime.getURL('utils/mutationUtils.js')))
})()

let navigateToVideos,
  navigateToPlaylists,
  focusFirstVideo,
  focusFirstPlaylist,
  goToHome,
  goToSubscriptions,
  focusFirstSubscription;
(async () => {
  ({
    navigateToVideos,
    navigateToPlaylists,
    focusFirstVideo,
    focusFirstPlaylist,
    goToHome,
    goToSubscriptions,
    focusFirstSubscription
  } = await import(browser.runtime.getURL('sites/youtube/utils.js')))
})()

const hotkeys = {
  'e': {
    category: 'General',
    description: 'Expand/Collapse guide sidebar',
    event: () => {
      guideButton = guideButton || document.querySelector('ytd-masthead #guide-button #button')
      guideButton.click()
    }
  },

  'o': {
    category: 'General',
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
          whenTargetMutates('#content.ytd-app', focusFirstVideo)
        }
      } else {
        focusFirstVideo()
      }
    }
  },

  'u': {
    category: 'General',
    description: 'Go to Subscriptions',
    event: () => {
      if (!locationEndsWith('/subscriptions')) {
        subscriptionsAnchor = subscriptionsAnchor || document.querySelector('#sections #endpoint[href="/feed/subscriptions"]')
        if (!subscriptionsAnchor) {
          guideButton = guideButton || document.querySelector('ytd-masthead #guide-button #button')
          guideButton.click()
          whenTargetMutates('#content.ytd-app', goToSubscriptions)
        } else {
          subscriptionsAnchor.click()
          whenTargetMutates('#content.ytd-app', focusFirstVideo)
        }
      } else {
        focusFirstVideo()
      }
    }
  },

  'U': {
    category: 'General',
    description: 'Expand and focus subscribed channels',
    verbatum: 'Shift+U',
    event: () => {
      guideButton = guideButton || document.querySelector('ytd-masthead #guide-button #button')
      if (guideButton.getAttribute('aria-pressed') === 'false' || guideButton.getAttribute('aria-pressed') === null) guideButton.click()

      showMoreSubscriptionsAnchor = showMoreSubscriptionsAnchor || document.querySelector('#sections ytd-guide-section-renderer:nth-child(2) ytd-guide-collapsible-entry-renderer tp-yt-paper-item')
      const firstChannelItem = document.querySelector('#sections ytd-guide-section-renderer:nth-child(2) tp-yt-paper-item')
      whenTargetMutates('#content.ytd-app', focusFirstSubscription)
      if (!showMoreSubscriptionsAnchor && !firstChannelItem) {
        whenTargetMutates('#content.ytd-app', focusFirstSubscription)
      } else {
        // TODO will not focus first channel when not on /subscriptions page, have to press button twice
        showMoreSubscriptionsAnchor?.click()
        firstChannelItem.focus()
      }

    }
  },

  's': {
    category: 'Video',
    description: 'Open settings',
    event: () => {
      if (!locationStartsWith('/watch')) return

      //#c4-player .ytp-settings-button
      settingsButton = settingsButton || document.querySelector('#movie_player .ytp-settings-button')
      settingsButton.click()
    }
  },

  'q': {
    category: 'Video',
    description: 'Open quality settings',
    event: () => {
      if (!locationStartsWith('/watch')) return

      settingsButton = settingsButton || document.querySelector('#movie_player .ytp-settings-button')
      if (settingsButton.getAttribute('aria-expanded') === 'false') {
        settingsButton.click()
        qualityButton = qualityButton || document.querySelector('#movie_player  .ytp-panel-menu .ytp-menuitem:last-child')
        qualityButton.click()
      } else {
        settingsButton.click()
      }

    }
  },

  ';': {
    category: 'Video',
    description: 'Show progress bar',
    event: () => {
      if (!locationStartsWith('/watch')) return

      moviePlayer = moviePlayer || document.querySelector('#movie_player')
      // TODO refactor
      moviePlayer.click()
      moviePlayer.click()
    }
  },

  'd': {
    category: 'Video',
    description: 'Scroll to description/video',
    event: () => {
      if (!locationStartsWith('/watch')) return

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
  },

  'r': {
    category: 'Video',
    description: 'Focus first related video',
    event: () => {
      if (!locationStartsWith('/watch')) return

      const relatedLink = document.querySelector('#related a.yt-simple-endpoint.style-scope.ytd-compact-video-renderer')
      relatedLink.focus()
    }
  },

  'E': {
    category: 'Video',
    description: 'Comment',
    verbatum: 'Shift+e',
    event: () => {
      if (!locationStartsWith('/watch')) return

      const commentBox = document.querySelector('ytd-comment-simplebox-renderer #placeholder-area')
      commentBox.click()
    }
  },

  'h': {
    category: 'Channel',
    description: 'Go to channel',
    event: () => {
      if (!locationStartsWith('/watch')) return

      const channelLink = document.querySelector('a.ytd-video-owner-renderer')
      channelLink.click()
    }
  },

  'H': {
    category: 'Channel',
    description: 'Go to channel (new tab)',
    verbatum: 'Shift+h',
    event: () => {
      if (!locationStartsWith('/watch')) return

      const channelLink = document.querySelector('a.ytd-video-owner-renderer')
      // TODO figure out why new tab opens with white background
      window.open(channelLink.href, '_blank')
    }
  },

  'v': {
    category: 'Channel',
    description: 'Go to channel videos',
    event: () => {
      if (!locationStartsWith('/watch', '/channel', '/c', '/user')) return

      if (locationStartsWith('/watch')) {
        const channelLink = document.querySelector('a.ytd-video-owner-renderer')
        channelLink.click()
      }

      // TODO refactor
      const videosTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-child(4)')
      if (videosTab) {
        if (!locationEndsWith('/videos')) videosTab.click()
        const firstVideo = document.querySelector('ytd-browse[role="main"] #items ytd-grid-video-renderer #video-title')
        if (firstVideo && locationEndsWith('/videos')) {
          firstVideo.focus()
        } else {
          whenTargetMutates('#content.ytd-app', focusFirstVideo)
        }
      } else {
        whenTargetMutates('#content.ytd-app', navigateToVideos)
      }

    }
  },

  'p': {
    category: 'Channel',
    description: 'Go to channel playlists',
    event: () => {
      if (!locationStartsWith('/watch', '/channel', '/c', '/user')) return

      if (locationStartsWith('/watch')) {
        const channelLink = document.querySelector('a.ytd-video-owner-renderer')
        channelLink.click()
      }

      const playlistsTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-child(6)')
      if (playlistsTab) {
        if (!locationEndsWith('/playlists')) playlistsTab.click()
        const firstPlaylist = document.querySelector('ytd-browse[role="main"] #items ytd-grid-playlist-renderer #video-title')
        if (firstPlaylist && locationEndsWith('/playlists')) {
          firstPlaylist.focus()
        } else {
          whenTargetMutates('#content.ytd-app', focusFirstPlaylist)
        }
      } else {
        whenTargetMutates('#content.ytd-app', navigateToPlaylists)
      }

    }
  }
}

Object.assign(keyboardOnlyNavigation.hotkeys, hotkeys)