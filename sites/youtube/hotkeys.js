let homeAnchor = null
let subscriptionsAnchor = null
let settingsButton = null
let qualityButton = null

// TODO use bundler to import these functions
function locationStartsWith(...prefixes) {
  for (const prefix of prefixes) {
    if (window.location.pathname.startsWith(prefix)) return true
  }
  return false
}

// function navigateToFirstVideo(mutations, observer) {
//   console.log('here1')
//   const videosTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-child(4)')
//   if (!videosTab) return
//   videosTab.click()

//   console.log('here2')

//   const firstVideo = document.querySelector('#items ytd-grid-video-renderer #video-title')
//   if (!firstVideo) return
//   firstVideo.focus()

//   observer.disconnect()
// }

const hotkeys = {
  'o': {
    category: 'General',
    description: 'Go to Home',
    event: () => {
      homeAnchor = homeAnchor || document.querySelector('#sections #endpoint[href="/"]')
      homeAnchor.click()
    }
  },

  'b': {
    category: 'General',
    description: 'Go to Subscriptions',
    event: () => {
      subscriptionsAnchor = subscriptionsAnchor || document.querySelector('#sections #endpoint[href="/feed/subscriptions"]')
      subscriptionsAnchor.click()
    }
  },

  's': {
    category: 'Video',
    description: 'Open settings',
    event: () => {
      if (window.location.pathname !== '/watch') return

      //#c4-player .ytp-settings-button
      settingsButton = settingsButton || document.querySelector('#movie_player .ytp-settings-button')
      settingsButton.click()
    }
  },

  'q': {
    category: 'Video',
    description: 'Open quality settings',
    event: () => {
      if (window.location.pathname !== '/watch') return

      settingsButton = settingsButton || document.querySelector('#movie_player  .ytp-settings-button')
      if (settingsButton.getAttribute('aria-expanded') === 'false') {
        settingsButton.click()
        qualityButton = qualityButton || document.querySelector('#movie_player  .ytp-panel-menu .ytp-menuitem:last-child')
        qualityButton.click()
      } else {
        settingsButton.click()
      }

    }
  },

  'd': {
    category: 'Video',
    description: 'Show more (less) description',
    event: () => {
      if (window.location.pathname !== '/watch') return

      const infoRenderer = document.querySelector('#info ytd-video-primary-info-renderer, #above-the-fold')
      infoRenderer.scrollIntoView()
      const showMoreButton = document.querySelector('.ytd-video-secondary-info-renderer tp-yt-paper-button#more, tp-yt-paper-button#expand')
      const showLessButton = document.querySelector('.ytd-video-secondary-info-renderer tp-yt-paper-button#less, tp-yt-paper-button#collapse')
      if (!showMoreButton.hidden) {
        showMoreButton.click()
      } else {
        showLessButton.click()
      }
    }
  },

  'r': {
    category: 'Video',
    description: 'Focus first related video',
    event: () => {
      if (window.location.pathname !== '/watch') return

      const relatedLink = document.querySelector('#related a.yt-simple-endpoint.style-scope.ytd-compact-video-renderer')
      relatedLink.focus()
    }
  },

  'h': {
    category: 'Video',
    description: 'Go to channel',
    event: () => {
      if (window.location.pathname !== '/watch') return

      const channelLink = document.querySelector('a.ytd-video-owner-renderer')
      channelLink.click()
    }
  },

  'H': {
    category: 'Video',
    description: 'Go to channel (new tab)',
    verbatum: 'Shift+h',
    event: () => {
      if (window.location.pathname !== '/watch') return

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
      
      // const content = document.querySelector('#content.ytd-app')
      // const observer = new MutationObserver(navigateToFirstVideo)
      // observer.observe(content, { childList: true, subtree: true})

      // TODO users will have to press hotkey a couple of times for it to work
      // because videos tab and first video do not exist at first
      const videosTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-child(4)')
      videosTab.click()

      const firstVideo = document.querySelector('#items ytd-grid-video-renderer #video-title')
      firstVideo.focus()

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

      // TODO same problem as above
      const playlistsTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-child(6)')
      playlistsTab.click()

      const firstPlaylist = document.querySelector('#items ytd-grid-playlist-renderer #video-title')
      firstPlaylist.focus()

    }
  }
}

Object.assign(keyboardOnlyNavigation.hotkeys, hotkeys)