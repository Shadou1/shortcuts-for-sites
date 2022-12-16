import(browser.runtime.getURL('shortcuts/reddit/shortcuts.js')).then(({ shortcuts }) => {
  shortcutsForSites.shortcuts = shortcuts
})
