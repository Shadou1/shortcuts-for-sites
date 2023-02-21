import Shortcuts, { Shortcut, ShortcutsCategory, ShortcutsJSONSerializable } from '../shortcuts/Shortcuts'

import allShortcuts from '../shortcuts/allShortcuts'
import { browserName } from '../utils/browserUtils'

// Get shortcuts for the current site
const shortcuts = allShortcuts.find(({ siteHostnameMatch }) => siteHostnameMatch.test(window.location.hostname))
if (!shortcuts) throw new Error('No shortcuts available')

void browser.runtime.sendMessage({
  type: 'isShortcutsAvailable',
  isShortcutsAvailable: true
})

// Initialize shortcuts
shortcuts.categories.forEach((category) => category.initialize?.())

// Get saved shortcut's keys
async function getStorageShortcutKeys(shortcuts: Shortcuts) {
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
await getStorageShortcutKeys(shortcuts)

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
  const shortcutsAvailable = new Map<string, boolean>()
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
      // CROSS BROWSER SUPPORT
      let shortcutsToSend: Shortcuts | ShortcutsJSONSerializable
      if (browserName === 'firefox') {
        shortcutsToSend = shortcuts
      } else if (browserName === 'chrome') {
        shortcutsToSend = JSON.parse(JSON.stringify(shortcuts)) as ShortcutsJSONSerializable
        for (let i = 0; i < shortcuts.categories.length; i++) {
          shortcutsToSend.categories[i].shortcuts = {}
          for (const [shortcutName, shortcut] of shortcuts.categories[i].shortcuts) {
            shortcutsToSend.categories[i].shortcuts[shortcutName] = shortcut
          }
        }
      }
      let shortcutsByKeyAvailableToSend: Map<string, boolean> | Record<string, boolean>
      if (browserName === 'firefox') {
        shortcutsByKeyAvailableToSend = getShortcutsAvailable(shortcutsByKey)
      } else if (browserName === 'chrome') {
        shortcutsByKeyAvailableToSend = Object.fromEntries(getShortcutsAvailable(shortcutsByKey))
      }

      sendResponse({
        type: 'shortcuts',
        shortcuts: shortcutsToSend!,
        shortcutsByKeyAvailable: shortcutsByKeyAvailableToSend!
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
    !shortcutConf.ignoreInput && (
      target instanceof HTMLInputElement ||
      target instanceof HTMLSelectElement ||
      target instanceof HTMLTextAreaElement ||
      target.isContentEditable
    )
  ) return

  if (shortcutConf.isAvailable && !shortcutConf.isAvailable()) return

  // if (ev.shiftKey) shortcutConf.eventShift?.(ev)
  if (ev.ctrlKey) shortcutConf.eventCtrl?.(ev)
  else if (ev.altKey) shortcutConf.eventAlt?.(ev)
  else shortcutConf.event(ev)
}, { capture: true })

// import { constructShortcutsReadmeMarkdown } from '../utils/markdownUtils'
// const markdown = constructShortcutsReadmeMarkdown()
// console.log(markdown)
