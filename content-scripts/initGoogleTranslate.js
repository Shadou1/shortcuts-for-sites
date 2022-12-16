import(browser.runtime.getURL('shortcuts/google/translate/shortcuts.js')).then(({ shortcuts }) => {
  shortcutsForSites.shortcuts = shortcuts
})
