let isShortcutsAvailable = false

const _shortcutsForSites = {
  shortcuts: new Map(),
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
      for (const [_, shortcut] of value) {
        shortcutsByKey.set(shortcut['defaultKey'], shortcut)
      }
      shortcutsSerialized = shortcutsToSerializable(value)
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
