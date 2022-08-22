browser.runtime.onMessage.addListener((message, sender) => {

  switch (message.type) {

    case 'isHotkeysAvailable':
      if (!message.isHotkeysAvailable) break
      browser.browserAction.setIcon({
        // path: {
        //   '16': 'icons/16.png',
        //   '32': 'icons/32.png',
        //   '64': 'icons/64.png'
        // },
        path: 'icons/browser-action-enabled.svg',
        tabId: sender.tab.id
      })
      break

  }

})
