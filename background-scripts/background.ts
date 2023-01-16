import './handleExtraGoogleDomains'

browser.runtime.onMessage.addListener((message: Record<string, unknown>, sender) => {

  switch (message.type) {

    case 'isShortcutsAvailable':
      if (!message.isShortcutsAvailable) return
      void browser.browserAction.setIcon({
        path: 'icons/browser-action-enabled.svg',
        tabId: sender.tab?.id
      })
      break

  }

})
