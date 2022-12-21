const popupHeading = document.querySelector('main > h1')
const nativeShortcutsHint = document.querySelector('.native-shortcuts-hint')
const shortcutsArticle = document.querySelector('article')
const sectionTemplate = document.querySelector('#shortcuts-section')
const rowTemplate = document.querySelector('#shortcut-row')

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

function fillPopupWithShortcuts(shortcuts, shortcutsAvailable) {
  popupHeading.hidden = true
  const newShortcuts = []
  let lastCategory = null
  let categorySection = null
  for (const [shortcutKey, { category, description }] of shortcuts) {
    if (category !== lastCategory) {
      lastCategory = category
      categorySection = sectionTemplate.content.cloneNode(true)
      categorySection.querySelector('h2').textContent = category
      newShortcuts.push(categorySection)
    }

    const shortcutRow = rowTemplate.content.cloneNode(true)
    shortcutRow.querySelector('.description').textContent = description
    const key = shortcutRow.querySelector('.key')
    if (!shortcutsAvailable.get(shortcutKey)) key.classList.remove('active-key')
    key.textContent = shortcutKey
    if (shortcutKey.match(/[A-Z]/)) {
      shortcutRow.querySelector('.verbatum').textContent = `Shift+${shortcutKey.toLowerCase()}`
    }
    categorySection.querySelector('section').append(shortcutRow)
  }

  shortcutsArticle.replaceChildren(...newShortcuts)
}

function handleShortcutsResponse(response) {
  if (!response.shortcuts.size) {
    clearPopup()
    // popupHeading.hidden = false
    return
  }
  nativeShortcutsHint.hidden = !response.hasNativeShortcuts
  fillPopupWithShortcuts(response.shortcuts, response.shortcutsAvailable)
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
