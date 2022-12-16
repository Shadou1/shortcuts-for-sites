import(browser.runtime.getURL('shortcuts/google/search/shortcuts.js')).then(({ shortcuts }) => {
  shortcutsForSites.shortcuts = shortcuts
})
