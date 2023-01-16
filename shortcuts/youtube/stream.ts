import { pathnameStartsWith } from '../../utils/locationUtils'
import { ShortcutsCategory } from '../Shortcuts'

const category = new ShortcutsCategory('Premiere/Stream', 'Premiere/Stream')
export default category

let hideChatButton: HTMLButtonElement | null
category.shortcuts.set('hideChat', {
  defaultKey: 'E',
  description: 'Hide/Show chat',
  isAvailable: () => {
    if (!pathnameStartsWith('/watch')) return false
    hideChatButton = hideChatButton?.offsetParent ? hideChatButton : document.querySelector('ytd-app ytd-live-chat-frame #show-hide-button button')
    return hideChatButton?.offsetParent
  },
  event: () => {
    hideChatButton!.click()
  }
})

let chatIframe: HTMLIFrameElement | null
let chatInputBox: HTMLInputElement | null
category.shortcuts.set('focusChatBox', {
  defaultKey: 'b',
  description: 'Chat',
  isAvailable: () => {
    if (!pathnameStartsWith('/watch')) return false
    try {
      // chatIframe and chatInputBox will become a dead object if chat is hidden
      chatIframe = document.querySelector('iframe#chatframe')
      if (!chatIframe?.offsetParent) return false
      chatInputBox = chatIframe.contentDocument!.querySelector('yt-live-chat-app yt-live-chat-text-input-field-renderer #input')
      return chatInputBox?.offsetParent
    } catch (error) {
      return false
    }
  },
  event: () => {
    chatInputBox!.focus()
  }
})

let skipToLiveBroadcastButton: HTMLButtonElement | null
category.shortcuts.set('skipToLiveBroadcast', {
  defaultKey: 'S',
  description: 'Skip ahead to live broadcast',
  isAvailable: () => {
    if (!pathnameStartsWith('/watch')) return false
    skipToLiveBroadcastButton = skipToLiveBroadcastButton?.offsetParent ? skipToLiveBroadcastButton : document.querySelector('#movie_player .ytp-left-controls button.ytp-live-badge')
    return skipToLiveBroadcastButton?.offsetParent
  },
  event: () => {
    skipToLiveBroadcastButton!.click()
  }
})
