import(browser.runtime.getURL('shortcuts/twitch/shortcuts.js')).then(({ shortcuts }) => {
  shortcutsForSites.site = 'twitch'
  shortcutsForSites.shortcuts = shortcuts
})
