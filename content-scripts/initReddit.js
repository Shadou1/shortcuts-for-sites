import(browser.runtime.getURL('shortcuts/reddit/shortcuts.js')).then(({ shortcuts }) => {
  shortcutsForSites.site = 'reddit'
  shortcutsForSites.shortcuts = shortcuts
})
