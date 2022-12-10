browser.runtime.onMessage.addListener((message, sender) => {

  switch (message.type) {

    case 'isShortcutsAvailable':
      if (!message.isShortcutsAvailable) break
      browser.browserAction.setIcon({
        path: 'icons/browser-action-enabled.svg',
        tabId: sender.tab.id
      })
      break

  }

})
