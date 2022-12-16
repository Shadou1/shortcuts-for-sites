import(browser.runtime.getURL('shortcuts/youtube/shortcuts.js')).then(({ shortcuts }) => {
  shortcutsForSites.shortcuts = shortcuts
})
