import { browserName } from '../utils/browserUtils'
import { extraGoogleDomains } from '../utils/extraDomains'

let registeredGoogleDomainsContentScript: browser.contentScripts.RegisteredContentScript | null

async function registerGoogleDomainsContentScript() {
  // On add-on load
  // Google Domains
  if (registeredGoogleDomainsContentScript) return
  const isAllowed = await browser.permissions.contains({
    origins: extraGoogleDomains
  })
  if (!isAllowed) return
  // CROSS BROWSER SUPPORT
  if (browserName === 'firefox') {
    const registeredContentScript = await browser.contentScripts.register({
      matches: extraGoogleDomains,
      js: [{
        file: 'content-scripts/init.js'
      }]
    })
    registeredGoogleDomainsContentScript = registeredContentScript
  } else if (browserName === 'chrome') {
    // TODO implement chrome extra domains content script injection
    // const registeredContentScript = await browser.tabs.executeScript({
    //   file: 'content-scripts/init.js'
    // })
  }
}

function unregisterGoogleDomainsContentScript() {
  if (!registeredGoogleDomainsContentScript) return
  void registeredGoogleDomainsContentScript.unregister()
  registeredGoogleDomainsContentScript = null
}

browser.runtime.onMessage.addListener((message: Record<string, unknown>, _sender) => {

  switch (message.type) {

    case 'registerGoogleDomainsContentScripts':
      void registerGoogleDomainsContentScript()
      break

    case 'unregisterGoogleDomainsContentScripts':
      unregisterGoogleDomainsContentScript()
      break

  }

})

void registerGoogleDomainsContentScript()
