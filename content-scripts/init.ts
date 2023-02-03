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
document.addEventListener('keydown', (ev) => {
  const shortcutConf = shortcutsByKey.get(ev.key)
  if (!shortcutConf) return

  const target = ev.target as HTMLElement
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLSelectElement ||
    target instanceof HTMLTextAreaElement ||
    target.isContentEditable
  ) return

  if (shortcutConf.isAvailable && !shortcutConf.isAvailable()) return

  // if (ev.shiftKey) shortcutConf.eventShift?.(ev)
  if (ev.ctrlKey) shortcutConf.eventCtrl?.(ev)
  else if (ev.altKey) shortcutConf.eventAlt?.(ev)
  else shortcutConf.event(ev)
})

// import { constructShortcutsReadmeMarkdown } from '../utils/markdownUtils'
// const markdown = constructShortcutsReadmeMarkdown()
// console.log(markdown)
