let settingsButton = null
let qualityButton = null

// TODO use bundler to import it from utils/locationStartsWith.js
function locationStartsWith(...prefixes) {
  for (const prefix of prefixes) {
    console.log(prefix)
    if (window.location.pathname.startsWith(prefix)) return true
  }
  return false
}


const hotkeys = {
  's': {
    description: 'Open settings',
    event: () => {
      if (window.location.pathname !== '/watch') return

      //#c4-player .ytp-settings-button
      settingsButton = settingsButton || document.querySelector('#movie_player .ytp-settings-button')
      settingsButton.click()  
    }
  },

  'q': {
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

  'h': {
    description: 'Go to channel',
    event: () => {
      if (window.location.pathname !== '/watch') return

      const channelLink = document.querySelector('a.ytd-video-owner-renderer')
      channelLink.click()  
    }
  },

  'r': {
    description: 'Focus first related',
    event: () => {
      if (window.location.pathname !== '/watch') return

      const relatedLink = document.querySelector('#related a.yt-simple-endpoint.style-scope.ytd-compact-video-renderer')
      relatedLink.focus()  
    }
  },
}

Object.assign(keyboardOnlyNavigation.hotkeys, hotkeys)