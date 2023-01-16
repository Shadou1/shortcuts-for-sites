import Shortcuts from '../../shortcuts/Shortcuts'

const popupHeading = document.querySelector<HTMLHeadingElement>('main > h1')!
const nativeShortcutsHint = document.querySelector<HTMLElement>('.native-shortcuts-hint')!
const shortcutsArticle = document.querySelector<HTMLElement>('article')!
const sectionTemplate = document.querySelector<HTMLTemplateElement>('#shortcuts-section')!
const rowTemplate = document.querySelector<HTMLTemplateElement>('#shortcut-row')!

function clearPopup() {
  popupHeading.textContent = 'No Available Shortcuts'
  popupHeading.hidden = false
  shortcutsArticle.replaceChildren()
}

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
function clearlPopupError() {
  popupHeading.textContent = 'Fetching Shortcuts'
  popupHeading.hidden = false
  shortcutsArticle.replaceChildren()
}

function fillPopupWithShortcuts(shortcuts: Shortcuts, shortcutsByKeyAvailable: Map<string, boolean>) {
  popupHeading.hidden = true
  const newShortcuts = []
  for (const category of shortcuts.categories) {
    const categorySection = sectionTemplate.content.cloneNode(true) as HTMLElement
    categorySection.querySelector('h2')!.textContent = category.name
    newShortcuts.push(categorySection)

    for (const [_shortcutName, shortcut] of category.shortcuts) {
      const shortcutRow = rowTemplate.content.cloneNode(true) as HTMLElement
      shortcutRow.querySelector('.description')!.textContent = shortcut.description
      const key = shortcutRow.querySelector('.key')!
      const shortcutKey = shortcut.key ?? shortcut.defaultKey
      key.textContent = shortcutKey
      if (!shortcutsByKeyAvailable.get(shortcutKey)) key.classList.remove('active-key')
      if (shortcutKey.match(/^[A-Z]$/)) {
        shortcutRow.querySelector('.verbatum')!.textContent = `Shift+${shortcutKey.toLowerCase()}`
      }
      categorySection.querySelector('section')!.append(shortcutRow)
    }
  }

  shortcutsArticle.replaceChildren(...newShortcuts)
}

function handleShortcutsResponse(response: { shortcuts: Shortcuts, shortcutsByKeyAvailable: Map<string, boolean> } | undefined) {
  if (!response) {
    clearPopup()
    // popupHeading.hidden = false
    return
  }
  nativeShortcutsHint.hidden = !response.shortcuts.siteHasNativeShortcuts
  fillPopupWithShortcuts(response.shortcuts, response.shortcutsByKeyAvailable)
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
    return browser.tabs.sendMessage(tabs[0].id!, { type: 'getShortcuts' })
  })
  .then(handleShortcutsResponse)
  // .catch(clearPopupError)
  .catch(clearPopup)

// DEBUG
// void browser.permissions.getAll().then((res) => console.log(res))
// void browser.storage.sync.get(undefined).then((res) => console.log(res))
