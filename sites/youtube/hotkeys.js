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

function locationEndsWith(...postfixes) {
  for (const postfix of postfixes) {
    if (window.location.pathname.endsWith(postfix)) return true
  }
  return false
}

function navigateToVideos(mutations, observer) {
  const videosTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-child(4)')
  if (!videosTab) return
  videosTab.click()

  const content = document.querySelector('#content.ytd-app')
  const observer2 = new MutationObserver(focusFirstVideo)
  observer2.observe(content, { childList: true, subtree: true})

  if (locationEndsWith('/videos')) observer.disconnect()
}

function navigateToPlaylists(mutations, observer) {
  const playlistsTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-child(6)')
  if (!playlistsTab) return
  playlistsTab.click()

  const content = document.querySelector('#content.ytd-app')
  const observer2 = new MutationObserver(focusFirsPlaylist)
  observer2.observe(content, { childList: true, subtree: true})

  if (locationEndsWith('/playlists')) observer.disconnect()
}

function focusFirstVideo(mutations, observer) {
  if (!locationEndsWith('/videos')) return

  const firstVideo = document.querySelector('#items ytd-grid-video-renderer #video-title')
  if (!firstVideo) return
  firstVideo.focus()

  observer.disconnect()
}

function focusFirsPlaylist(mutations, observer) {
  if (!locationEndsWith('/playlists')) return

  const firstPlaylist = document.querySelector('#items ytd-grid-playlist-renderer #video-title')
  if (!firstPlaylist) return
  firstPlaylist.focus()

  observer.disconnect()
  
}

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

  'e': {
    category: 'Video',
    description: 'Comment',
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
      if (window.location.pathname !== '/watch') return

      const channelLink = document.querySelector('a.ytd-video-owner-renderer')
      channelLink.click()
    }
  },

  'H': {
    category: 'Channel',
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

      // TODO refactor
      const videosTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-child(4)')
      if (videosTab) {
        videosTab.click()
        const firstVideo = document.querySelector('#items ytd-grid-video-renderer #video-title')
        if (firstVideo && locationEndsWith('/videos')) {
          firstVideo.focus()
        } else {
          const content = document.querySelector('#content.ytd-app')
          const observer = new MutationObserver(focusFirstVideo)
          observer.observe(content, { childList: true, subtree: true})
        }
      } else {
        const content = document.querySelector('#content.ytd-app')
        const observer = new MutationObserver(navigateToVideos)
        observer.observe(content, { childList: true, subtree: true})
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
        playlistsTab.click()
        const firstPlaylist = document.querySelector('#items ytd-grid-playlist-renderer #video-title')
        if (firstPlaylist && locationEndsWith('/playlists')) {
          firstPlaylist.focus()
        } else {
          const content = document.querySelector('#content.ytd-app')
          const observer = new MutationObserver(focusFirsPlaylist)
          observer.observe(content, { childList: true, subtree: true})
        }
      } else {
        const content = document.querySelector('#content.ytd-app')
        const observer = new MutationObserver(navigateToPlaylists)
        observer.observe(content, { childList: true, subtree: true})
      }

    }
  }
}

Object.assign(keyboardOnlyNavigation.hotkeys, hotkeys)