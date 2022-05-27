let settingsButton = null
let qualityButton = null

const hotkeys = {
  's': () => {
    if (window.location.pathname !== '/watch') return

    settingsButton = settingsButton || document.querySelector('.ytp-settings-button')
    settingsButton.click()
  },

  'q': () => {
    if (window.location.pathname !== '/watch') return

    settingsButton = settingsButton || document.querySelector('.ytp-settings-button')
    if (settingsButton.getAttribute('aria-expanded') === 'false') {
      settingsButton.click()
      qualityButton = qualityButton || document.querySelector('.ytp-panel-menu .ytp-menuitem:last-child')
      qualityButton.click()
    } else {
      settingsButton.click()
    }
  }
}

Object.assign(keyboardOnlyNavigation.hotkeys, hotkeys)