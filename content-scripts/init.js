let isShortcutsAvailable = false

const _shortcutsForSites = {
  shortcuts: new Map(),
  site: null
}
const shortcutsByKey = new Map()
let shortcutsSerialized = new Map()

function shortcutsToSerializable(shortcuts) {
  return shortcuts
}
const shortcutsProxyHandler = {
  set(target, prop, value) {
    if (!isShortcutsAvailable) {
      browser.runtime.sendMessage({
        type: 'isShortcutsAvailable',
        isShortcutsAvailable: true
      })
      isShortcutsAvailable = true
    }

    if (prop === 'shortcuts') {
      browser.storage.sync.get(shortcutsForSites.site).then((savedShortcuts) => {
        const savedShortcutsSite = savedShortcuts[shortcutsForSites.site]
        for (const [shortcutName, shortcut] of value) {
          const key = savedShortcutsSite?.[shortcutName] || shortcut.defaultKey
          shortcutsByKey.set(key, shortcut)
        }
        shortcutsSerialized = shortcutsToSerializable(shortcutsByKey)
      })
    }

    return Reflect.set(target, prop, value)
  }
}
// Global object
var shortcutsForSites = new Proxy(_shortcutsForSites, shortcutsProxyHandler)

// Browser action asks for shortcuts for the current page
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'getShortcuts':
      sendResponse({
        type: 'shortcuts',
        shortcuts: shortcutsSerialized
      })
      break
  }
})

// Import matching shortcuts
async function importShortcuts() {
  const { siteMatches } = await import(browser.runtime.getURL('shortcuts/siteMatches.js'))

  for (const [site, { hostnameMatch, path }] of Object.entries(siteMatches)) {
    if (!window.location.hostname.match(hostnameMatch)) continue

    const { shortcuts } = await import(browser.runtime.getURL(path))
    shortcutsForSites.site = site
    shortcutsForSites.shortcuts = shortcuts
    return
  }
}
importShortcuts()

// Handle shortcuts

let isLastInputEvent = false
document.addEventListener('input', (_ev) => {
  isLastInputEvent = true
})

let lastTimeout = null
document.addEventListener('keydown', (ev) => {

  clearTimeout(lastTimeout)
  // Execute event listener after a timeout to ensure that it is not firing together with an input event
  lastTimeout = setTimeout(() => {

    if (isLastInputEvent) {
      isLastInputEvent = false
      return
    }

    const shortcutConf = shortcutsByKey.get(ev.key)
    if (!shortcutConf) return

    // if (ev.shiftKey) shortcutConf.eventShift?.(ev)
    if (ev.ctrlKey) shortcutConf.eventCtrl?.(ev)
    else if (ev.altKey) shortcutConf.eventAlt?.(ev)
    else shortcutConf.event(ev)

  }, 10)

})
