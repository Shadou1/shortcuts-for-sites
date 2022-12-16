const popup = document.querySelector('ytd-popup-container')

const insertShortcutsInfo = (mutations, observer) => {

  const hotkeyDialogSection2 = popup.querySelector('ytd-hotkey-dialog-section-renderer:nth-child(2)')
  if (!hotkeyDialogSection2) return

  const subTitle = hotkeyDialogSection2.querySelector('#sub-title').cloneNode(true)
  subTitle.textContent = 'Additional hotkeys'
  hotkeyDialogSection2.appendChild(subTitle)

  const options = hotkeyDialogSection2.querySelector('#options').cloneNode()
  hotkeyDialogSection2.appendChild(options)

  const optionSource = hotkeyDialogSection2.querySelector('ytd-hotkey-dialog-section-option-renderer')

  for (const [_, { description, defaultKey }] of shortcutsForSites.shortcuts) {
    const option = optionSource.cloneNode(true)
    options.append(option)
    option.querySelector('#label').textContent = description
    option.querySelector('#hotkey').textContent = defaultKey
  }

  observer.disconnect()

}

const observer = new MutationObserver(insertShortcutsInfo)
observer.observe(popup, { childList: true, subtree: true })
