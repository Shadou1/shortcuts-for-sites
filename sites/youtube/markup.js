const popup = document.querySelector('ytd-popup-container')
const insertHotkeysInfo = (mutations, observer) => {

  const hotkeyDialogSection2 = popup.querySelector('ytd-hotkey-dialog-section-renderer:nth-child(2)')
  if (!hotkeyDialogSection2) return

  const subTitle = hotkeyDialogSection2.querySelector('#sub-title').cloneNode(true)
  subTitle.textContent = 'Settings'
  hotkeyDialogSection2.appendChild(subTitle)

  const optionsDiv = hotkeyDialogSection2.querySelector('#options').cloneNode()
  hotkeyDialogSection2.appendChild(optionsDiv)

  let option = hotkeyDialogSection2.querySelector('ytd-hotkey-dialog-section-option-renderer').cloneNode(true)
  optionsDiv.append(option)
  option.querySelector('#label').textContent = 'Open settings'
  option.querySelector('#hotkey').textContent = 's'

  option = option.cloneNode(true)
  optionsDiv.append(option)
  option.querySelector('#label').textContent = 'Open quality settings'
  option.querySelector('#hotkey').textContent = 'q'

  observer.disconnect()

}

const observer = new MutationObserver(insertHotkeysInfo)
observer.observe(popup, { childList: true, subtree: true })