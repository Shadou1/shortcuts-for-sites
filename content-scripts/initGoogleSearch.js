import(browser.runtime.getURL('shortcuts/google/search/shortcuts.js')).then(({ shortcuts }) => {
  shortcutsForSites.site = 'google-search'
  shortcutsForSites.shortcuts = shortcuts
})
