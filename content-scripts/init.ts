import Shortcuts, { Shortcut, ShortcutsCategory } from '../shortcuts/Shortcuts'

import allShortcuts from '../shortcuts/allShortcuts'

// Get shortcuts for the current site
const shortcuts = allShortcuts.find(({ siteHostnameMatch }) => siteHostnameMatch.test(window.location.hostname))
if (!shortcuts) throw new Error('No shortcuts available')

void browser.runtime.sendMessage({
  type: 'isShortcutsAvailable',
  isShortcutsAvailable: true
})

// Get saved shortcut's keys
async function setShortcutKeys(shortcuts: Shortcuts) {
  const savedShortcuts: Record<string, Record<string, string>> = await browser.storage.sync.get(shortcuts.site)
  const savedShortcutsForSite = savedShortcuts[shortcuts.site]
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!savedShortcutsForSite) return
  shortcuts.categories.forEach((category) => {
    category.shortcuts.forEach((shortcut, shortcutName) => {
      shortcut.key = savedShortcutsForSite[shortcutName]
    })
  })
}
await setShortcutKeys(shortcuts)

// Get shortcuts by key
function getShortcutsByKey(shortcutsCategories: ShortcutsCategory[]) {
  const shortcutsByKey = new Map<string, Shortcut>()
  shortcutsCategories.forEach((category) => {
    category.shortcuts.forEach((shortcut) => {
      shortcutsByKey.set(shortcut.key ?? shortcut.defaultKey, shortcut)
    })
  })
  return shortcutsByKey
}
const shortcutsByKey = getShortcutsByKey(shortcuts.categories)

function getShortcutsAvailable(shortcutsByKey: Map<string, Shortcut>) {
  const shortcutsAvailable = new Map()
  for (const [key, shortcut] of shortcutsByKey) {
    let isAvailable = true
    if (shortcut.isAvailable && !shortcut.isAvailable()) isAvailable = false
    shortcutsAvailable.set(key, isAvailable)
  }
  return shortcutsAvailable
}

// Browser action asks for shortcuts for the current page
browser.runtime.onMessage.addListener((message: Record<string, unknown>, sender, sendResponse) => {
  switch (message.type) {
    case 'getShortcuts':
      sendResponse({
        type: 'shortcuts',
        shortcuts,
        shortcutsByKeyAvailable: getShortcutsAvailable(shortcutsByKey),
      })
      break
  }
})

// Handle shortcuts

let isLastInputEvent = false
document.addEventListener('input', (_ev) => {
  isLastInputEvent = true
})

let lastTimeout: ReturnType<typeof setTimeout>
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
    if (shortcutConf.isAvailable && !shortcutConf.isAvailable()) return

    // if (ev.shiftKey) shortcutConf.eventShift?.(ev)
    if (ev.ctrlKey) shortcutConf.eventCtrl?.()
    else if (ev.altKey) shortcutConf.eventAlt?.()
    else shortcutConf.event()

  }, 10)

})
