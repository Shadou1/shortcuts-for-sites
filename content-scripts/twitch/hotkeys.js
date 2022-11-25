let settingsButton = null // inconsistent
let qualityButton = null // inconsistent
let chatTextarea = null // inconsistent
let collapseLeftNavButton = null
let collapseChatButton = null

let locationStartsWith, locationEndsWith;
(async () => {
  ({ locationStartsWith, locationEndsWith } = await import(browser.runtime.getURL('utils/locationUtils.js')))
})()

let whenTargetMutates;
(async () => {
  ({ whenTargetMutates } = await import(browser.runtime.getURL('utils/mutationUtils.js')))
})()

let focusFirstChannel,
  navigateToVideos,
  focusFirstVideo,
  navigateToSchedule;
(async () => {
  ({
    focusFirstChannel,
    navigateToVideos,
    focusFirstVideo,
    navigateToSchedule,
  } = await import(browser.runtime.getURL('utils/twitch.js')))
})()

const hotkeys = {

  'E': {
    category: 'General',
    description: 'Expand/collapse left sidebar',
    verbatum: 'Shift+e',
    event: () => {
      collapseLeftNavButton = collapseLeftNavButton || document.querySelector('button[data-a-target="side-nav-arrow"]')
      collapseLeftNavButton.click()
    }
  },

  'u': {
    category: 'General',
    description: 'Focus followed channels',
    event: () => {
      // collapseLeftNavButton = collapseLeftNavButton || document.querySelector('button[data-a-target="side-nav-arrow"]')
      const firstFollowedChannel = document.querySelector('#side-nav .tw-transition-group a[data-test-selector="followed-channel"]')
      firstFollowedChannel?.focus()
    }
  },

  'r': {
    category: 'General',
    description: 'Focus recommended channels',
    event: () => {
      // collapseLeftNavButton = collapseLeftNavButton || document.querySelector('button[data-a-target="side-nav-arrow"]')
      const firstRecommendedChannel = document.querySelector('#side-nav .tw-transition-group a[data-test-selector="recommended-channel"]')
      firstRecommendedChannel?.focus()
    }
  },

  's': {
    category: 'Stream',
    description: 'Open settings',
    event: () => {
      const allSettingsButtons = document.querySelectorAll('#channel-player button[data-a-target="player-settings-button"]')
      settingsButton = allSettingsButtons[allSettingsButtons.length - 1]
      settingsButton.click()
      // qualityButton = qualityButton || document.querySelector('div[data-a-target="player-settings-menu"] button[data-a-target="player-settings-menu-item-quality"]')
      qualityButton = document.querySelector('div[data-a-target="player-settings-menu"] button[data-a-target="player-settings-menu-item-quality"]')
      qualityButton.focus()
    }
  },

  'q': {
    category: 'Stream',
    description: 'Open quality settings',
    event: () => {
      const allSettingsButtons = document.querySelectorAll('#channel-player button[data-a-target="player-settings-button"]')
      settingsButton = allSettingsButtons[allSettingsButtons.length - 1]
      settingsButton.click()
      qualityButton = document.querySelector('div[data-a-target="player-settings-menu"] button[data-a-target="player-settings-menu-item-quality"]')
      qualityButton.click()
      const currentQualityInput = document.querySelector('div[data-a-target="player-settings-menu"] input[checked=""]')
      currentQualityInput.focus()
    }
  },

  'o': {
    category: 'Stream',
    description: 'Go to stream category',
    event: () => {
      if (window.location.pathname === '/') return

      if (locationStartsWith('/directory')) {
        focusFirstChannel()
        return
      }

      const streamGameAnchor = document.querySelector('a[data-a-target="stream-game-link"]')
      if (!streamGameAnchor) return
      streamGameAnchor.click()
      whenTargetMutates('main', focusFirstChannel)
    }
  },

  'd': {
    category: 'Stream',
    description: 'Scroll to description/video',
    event: () => {
      const streamInformatinoSection = document.querySelector('.channel-info-content section#live-channel-stream-information')
      if (document.activeElement !== streamInformatinoSection) {
        streamInformatinoSection.focus()
        streamInformatinoSection.scrollIntoView()
      } else {
        streamInformatinoSection.blur()
        const video = document.querySelector('video')
        video.scrollIntoView()
      }
    }
  },

  'h': {
    category: 'Stream',
    description: 'Go to online/offline channel sections',
    event: () => {
      const channelAnchor = document.querySelector('#live-channel-stream-information a:not([href^="/directory"], [data-a-target="stream-game-link"]), #offline-channel-main-content a')
      channelAnchor.click()
    }
  },

  'c': {
    category: 'Chat',
    description: 'Focus chat box',
    event: () => {
      // chatTextarea = chatTextarea || document.querySelector('textarea[data-a-target="chat-input"]')
      chatTextarea = document.querySelector('[data-a-target="chat-input"]')
      chatTextarea.focus()
    }
  },

  'e': {
    category: 'Chat',
    description: 'Expand/collapse chat',
    event: () => {
      collapseChatButton = collapseChatButton || document.querySelector('button[data-a-target="right-column__toggle-collapse-btn"]')
      collapseChatButton.click()
    }
  },

  'v': {
    category: 'Channel',
    description: 'Go to channel videos',
    event: () => {
      const videosAnchor = document.querySelector('a[tabname="videos"]')
      if (videosAnchor) {
        if (locationEndsWith('/videos')) {
          const firstVideo = document.querySelector('[data-test-selector="preview-card-carousel-child-container"] a')
          firstVideo.focus()
        } else {
          videosAnchor.click()
          whenTargetMutates('main', focusFirstVideo)
        }
      } else {
        const channelAnchor = document.querySelector('#live-channel-stream-information a:not([href^="/directory"], .tw-link, [data-test-selector="clips-watch-full-button"]), #offline-channel-main-content a')
        channelAnchor.click()
        whenTargetMutates('main', navigateToVideos)
      }
    }
  },

  'b': {
    category: 'Channel',
    description: 'Go to channel schedule',
    event: () => {
      const scheduleAnchor = document.querySelector('a[tabname="schedule"]')
      if (scheduleAnchor) {
        if (locationEndsWith('/schedule')) {
          scheduleAnchor.focus()
        } else {
          scheduleAnchor.click()
          scheduleAnchor.focus()
        }
      } else {
        const channelAnchor = document.querySelector('#live-channel-stream-information a:not([href^="/directory"]):not(.tw-link):not([data-test-selector="clips-watch-full-button"]), #offline-channel-main-content a')
        channelAnchor.click()
        whenTargetMutates('main', navigateToSchedule)
      }
    }
  },

  // Predictions
  // button[data-test-selector="community-prediction-highlight-header__action-button"]

}

Object.assign(keyboardOnlyNavigation.hotkeys, hotkeys)
