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
  const registeredContentScript = await browser.contentScripts.register({
    matches: extraGoogleDomains,
    js: [{
      file: 'content-scripts/init.js'
    }]
  })
  registeredGoogleDomainsContentScript = registeredContentScript
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
