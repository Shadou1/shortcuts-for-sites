import(browser.runtime.getURL('shortcuts/google/translate/shortcuts.js')).then(({ shortcuts }) => {
  shortcutsForSites.site = 'google-translate'
  shortcutsForSites.shortcuts = shortcuts
})
