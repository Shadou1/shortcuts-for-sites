let settingsButton = null
let qualityButton = null
let collapseChatButton = null
let chatTextarea = null

const hotkeys = {
  's': {
    category: 'Stream',
    description: 'Open settings',
    event: () => {
      settingsButton = settingsButton || document.querySelector('#channel-player button[data-a-target="player-settings-button"]')
      settingsButton.click()
      // Quality button is inconsistent?
      // qualityButton = qualityButton || document.querySelector('div[data-a-target="player-settings-menu"] button[data-a-target="player-settings-menu-item-quality"]')
      qualityButton = document.querySelector('div[data-a-target="player-settings-menu"] button[data-a-target="player-settings-menu-item-quality"]')
      qualityButton.focus()
    }
  },
  'q': {
    category: 'Stream',
    description: 'Open quality settings',
    event: () => {
      settingsButton = settingsButton || document.querySelector('#channel-player button[data-a-target="player-settings-button"]')
      settingsButton.click()
      qualityButton = document.querySelector('div[data-a-target="player-settings-menu"] button[data-a-target="player-settings-menu-item-quality"]')
      qualityButton.click()
      const currentQualityInput = document.querySelector('div[data-a-target="player-settings-menu"] input[checked=""]')
      currentQualityInput.focus()
    }
  },
  'c': {
    category: 'Chat',
    description: 'Focus chat box',
    event: () => {
      // Chat textarea is inconsistent?
      // chatTextarea = chatTextarea || document.querySelector('textarea[data-a-target="chat-input"]')
      chatTextarea = document.querySelector('textarea[data-a-target="chat-input"]')
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