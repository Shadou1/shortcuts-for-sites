const popupHeading = document.querySelector('main > h1')
const hotkeysContainer = document.querySelector('.hotkeys-container')

function clearPopup() {
  popupHeading.textContent = 'No Available Hotkeys'
  hotkeysContainer.replaceChildren()
}

function clearPopupError() {
  popupHeading.textContent = 'Fetching Hotkeys'
  hotkeysContainer.replaceChildren()
}

function fillPopupWithHotkeys(hotkeys) {
  const newHotkeys = []
  for (const [hotkey, { description, verbatum }] of Object.entries(hotkeys)) {
    const hotkeyRow = document.createElement('div')
    const hotkeyDescription = document.createElement('p')
    hotkeyDescription.textContent = description
    const hotkeyLetter = document.createElement('p')
    hotkeyLetter.textContent = verbatum ? `${hotkey} (${verbatum})` : hotkey
    hotkeyRow.append(hotkeyDescription, hotkeyLetter)
    newHotkeys.push(hotkeyRow)
  }
  hotkeysContainer.replaceChildren(...newHotkeys)
}

function handleHotkeysResponse(response) {
  if (!Object.keys(response.hotkeys).length) {
    clearPopup()
    return
  }
  popupHeading.textContent = 'Available Hotkeys'
  fillPopupWithHotkeys(response.hotkeys)
}

// query hotkeys on newly activated tabs
browser.tabs.onActivated.addListener((tab) => {
  browser.tabs.sendMessage(tab.tabId, { type: 'getHotkeys' })
    .then(handleHotkeysResponse)
    .catch(clearPopup)
})

// query hotkeys for the active tab
browser.tabs.query({
  active: true,
  windowId: browser.windows.WINDOW_ID_CURRENT,
})
  .then((tabs) => {

    // In case tab is still loading when user opens browser action
    browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
      if (tabs[0].id === tabId && changeInfo.status === 'complete') {
        browser.tabs.sendMessage(tabs[0].id, { type: 'getHotkeys' })
          .then(handleHotkeysResponse)
          .catch(clearPopup)
      }
    })

    popupHeading.textContent = 'Fetching Hotkeys'
    return browser.tabs.sendMessage(tabs[0].id, { type: 'getHotkeys' })
  })
  .then(handleHotkeysResponse)
  .catch(clearPopupError)