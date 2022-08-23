let settingsButton = null // inconsistent
let qualityButton = null // inconsistent
let chatTextarea = null // inconsistent
let collapseLeftNavButton = null
let collapseChatButton = null

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
      const streamGameAnchor = document.querySelector('a[data-a-target="stream-game-link"]')
      streamGameAnchor.click()
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

}

Object.assign(keyboardOnlyNavigation.hotkeys, hotkeys)
