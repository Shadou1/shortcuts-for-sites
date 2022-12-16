import(browser.runtime.getURL('shortcuts/twitch/shortcuts.js')).then(({ shortcuts }) => {
  shortcutsForSites.shortcuts = shortcuts
})
