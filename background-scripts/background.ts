import './handleExtraGoogleDomains'
import { browserName } from '../utils/browserUtils'

browser.runtime.onMessage.addListener((message: Record<string, unknown>, sender) => {

  switch (message.type) {

    case 'isShortcutsAvailable':
      if (!message.isShortcutsAvailable) return

      let path: string | Record<string, string>
      if (browserName === 'firefox') {
        path = 'icons/browser-action-enabled.svg'
      } else if (browserName === 'chrome') {
        path = {
          "16": "icons/browser-action-enabled-16.png",
          "24": "icons/browser-action-enabled-24.png",
          "32": "icons/browser-action-enabled-32.png",
          "48": "icons/browser-action-enabled-48.png",
          "64": "icons/browser-action-enabled-64.png",
          "96": "icons/browser-action-enabled-96.png",
          "128": "icons/browser-action-enabled-128.png"
        }
      }
      void browser.browserAction.setIcon({
        path: path!,
        tabId: sender.tab?.id
      })
      break
  }
})

