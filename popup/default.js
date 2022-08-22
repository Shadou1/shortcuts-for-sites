const popupHeading = document.querySelector('main > h1')
const hotkeysArticle = document.querySelector('article')

function clearPopup() {
  popupHeading.textContent = 'No Available Hotkeys'
  popupHeading.hidden = false
  hotkeysArticle.replaceChildren()
}

function clearPopupError() {
  popupHeading.textContent = 'Fetching Hotkeys'
  popupHeading.hidden = false
  hotkeysArticle.replaceChildren()
}

function fillPopupWithHotkeys(hotkeys) {
  popupHeading.hidden = true

  const newHotkeys = []
  let lastCategory = null
  let categorySection = null
  for (const [hotkey, { category, description, verbatum }] of Object.entries(hotkeys)) {
    if (category !== lastCategory) {
      lastCategory = category
      categorySection = document.createElement('section')
      const categoryHeading = document.createElement('h2')
      categoryHeading.textContent = category
      categorySection.appendChild(categoryHeading)
      newHotkeys.push(categorySection)
    }

    const hotkeyRow = document.createElement('div')
    const hotkeyDescription = document.createElement('p')
    hotkeyDescription.textContent = description
    const hotkeyLetter = document.createElement('p')
    hotkeyLetter.textContent = verbatum ? `${hotkey} (${verbatum})` : hotkey
    hotkeyRow.append(hotkeyDescription, hotkeyLetter)
    categorySection.append(hotkeyRow)
  }
  
  hotkeysArticle.replaceChildren(...newHotkeys)
}

function handleHotkeysResponse(response) {
  if (!Object.keys(response.hotkeys).length) {
    clearPopup()
    // popupHeading.hidden = false
    return
  }
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
  // .catch(clearPopupError)
  .catch(clearPopup)
