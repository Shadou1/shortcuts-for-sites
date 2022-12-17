import(browser.runtime.getURL('shortcuts/youtube/shortcuts.js')).then(({ shortcuts }) => {
  shortcutsForSites.site = 'youtube'
  shortcutsForSites.shortcuts = shortcuts
})
