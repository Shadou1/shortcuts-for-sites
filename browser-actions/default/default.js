const popupHeading = document.querySelector('main > h1')
const shortcutsArticle = document.querySelector('article')

function clearPopup() {
  popupHeading.textContent = 'No Available Shortcuts'
  popupHeading.hidden = false
  shortcutsArticle.replaceChildren()
}

function clearlPopupError() {
  popupHeading.textContent = 'Fetching Shortcuts'
  popupHeading.hidden = false
  shortcutsArticle.replaceChildren()
}

function fillPopupWithShortcuts(shortcuts) {
  popupHeading.hidden = true

  const newShortcuts = []
  let lastCategory = null
  let categorySection = null
  for (const [shortcut, { category, description, verbatum }] of Object.entries(shortcuts)) {
    if (category !== lastCategory) {
      lastCategory = category
      categorySection = document.createElement('section')
      const categoryHeading = document.createElement('h2')
      categoryHeading.textContent = category
      categorySection.appendChild(categoryHeading)
      newShortcuts.push(categorySection)
    }

    const shortcutRow = document.createElement('div')
    const shortcutDescription = document.createElement('p')
    shortcutDescription.textContent = description
    const shortcutButton = document.createElement('p')
    const shortcutKey = document.createElement('span')
    shortcutKey.textContent = shortcut
    shortcutButton.appendChild(shortcutKey)
    if (verbatum) shortcutButton.append(` (${verbatum})`)
    shortcutRow.append(shortcutDescription, shortcutButton)
    categorySection.append(shortcutRow)
  }

  shortcutsArticle.replaceChildren(...newShortcuts)
}

function handleShortcutsResponse(response) {
  if (!Object.keys(response.shortcuts).length) {
    clearPopup()
    // popupHeading.hidden = false
    return
  }
  fillPopupWithShortcuts(response.shortcuts)
}

// query shortcuts on newly activated tabs
browser.tabs.onActivated.addListener((tab) => {
  browser.tabs.sendMessage(tab.tabId, { type: 'getShortcuts' })
    .then(handleShortcutsResponse)
    .catch(clearPopup)
})

// query shortcuts for the active tab
browser.tabs.query({
  active: true,
  windowId: browser.windows.WINDOW_ID_CURRENT,
})
  .then((tabs) => {

    // In case tab is still loading when user opens browser action
    browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
      if (tabs[0].id === tabId && changeInfo.status === 'complete') {
        browser.tabs.sendMessage(tabs[0].id, { type: 'getShortcuts' })
          .then(handleShortcutsResponse)
          .catch(clearPopup)
      }
    })

    popupHeading.textContent = 'Fetching Shortcuts'
    return browser.tabs.sendMessage(tabs[0].id, { type: 'getShortcuts' })
  })
  .then(handleShortcutsResponse)
  // .catch(clearPopupError)
  .catch(clearPopup)
