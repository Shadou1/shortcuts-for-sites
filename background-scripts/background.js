/* eslint-disable no-case-declarations */

let extraGoogleDomains
let registeredGoogleDomainsContentScript
browser.runtime.onMessage.addListener(async (message, sender) => {

  switch (message.type) {

    case 'isShortcutsAvailable':
      if (!message.isShortcutsAvailable) break
      browser.browserAction.setIcon({
        path: 'icons/browser-action-enabled.svg',
        tabId: sender.tab.id
      })
      break

    case 'registerGoogleDomainsContentScripts':
      if (registeredGoogleDomainsContentScript) return
      const isAllowed = await browser.permissions.contains({
        origins: extraGoogleDomains
      })
      if (!isAllowed) return
      const registeredContentScript = await browser.contentScripts.register({
        matches: extraGoogleDomains,
        js: [{
          file: 'content-scripts/init.js'
        }]
      })
      registeredGoogleDomainsContentScript = registeredContentScript
      break

    case 'unregisterGoogleDomainsContentScripts':
      if (!registeredGoogleDomainsContentScript) return
      registeredGoogleDomainsContentScript.unregister()
      registeredGoogleDomainsContentScript = null
      break

  }

});

(async () => {
  // On add-on load
  // Google Domains
  ({ extraGoogleDomains } = await import(browser.runtime.getURL('utils/extraDomains.js')))
  if (registeredGoogleDomainsContentScript) return
  const isAllowed = await browser.permissions.contains({
    origins: extraGoogleDomains
  })
  if (!isAllowed) return
  const registeredContentScript = await browser.contentScripts.register({
    matches: extraGoogleDomains,
    js: [{
      file: 'content-scripts/init.js'
    }]
  })
  registeredGoogleDomainsContentScript = registeredContentScript
})()
