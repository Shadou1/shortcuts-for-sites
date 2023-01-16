import { ShortcutsCategory } from '../Shortcuts'

const category = new ShortcutsCategory('Chat', 'Chat')
export default category

let chatTextarea: HTMLElement | null
category.shortcuts.set('focusChatBox', {
  defaultKey: 'c',
  description: 'Chat',
  isAvailable: () => {
    chatTextarea = document.querySelector('[data-a-target="chat-input"]')
    return chatTextarea?.offsetParent
  },
  event: () => {
    chatTextarea!.focus()
  }
})

let collapseChatButton: HTMLElement | null
category.shortcuts.set('expandChat', {
  defaultKey: 'e',
  description: 'Expand/collapse chat',
  isAvailable: () => {
    collapseChatButton = document.querySelector('button[data-a-target="right-column__toggle-collapse-btn"]')
    return collapseChatButton?.offsetParent
  },
  event: () => {
    collapseChatButton!.click()
  }
})

// Predictions
// button[data-test-selector="community-prediction-highlight-header__action-button"]
