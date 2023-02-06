import googleRunOnAllDomainsSetting from './settings/googleRunOnAllDomains'
import { populateAllShortcuts, selectFirstShortcutsTab, saveShortcuts, clearShortcuts } from './shortcuts'

const settings = [
  googleRunOnAllDomainsSetting
]

async function loadSettings() {
  // Load settings
  settings.forEach((setting) => void setting.handleLoad?.())

  // Load simple settings
  const settingsStorage = await browser.storage.sync.get('settings')
  if (!settingsStorage['settings']) return
  Object.entries(settingsStorage['settings'] as Record<string, unknown>).forEach(([settingName, settingValue]) => {

    // Ignore special settings
    if (settings.findIndex((setting) => setting.name === settingName) !== -1) return

    const settingInput = document.querySelector<HTMLInputElement>(`#panel-settings input:is(#${settingName}, [name="${settingName}"])`)
    if (!settingInput) return

    switch (settingInput.type) {
      case 'checkbox':
        settingInput.checked = settingValue as boolean
        break
      // TODO hande radio buttons more gracefully
      case 'radio':
        const toCheckRadioButton = document.querySelector<HTMLInputElement>(`#panel-settings input[name="${settingName}"][value="${settingValue as string}"]`)
        if (!toCheckRadioButton) break
        toCheckRadioButton.checked = true
        break
    }

  })
}

const saveButton = document.querySelector<HTMLButtonElement>('#save-settings-button')!
async function saveSettings() {
  // Settings
  const storage = await browser.storage.sync.get('settings')
  const savedSettings = storage['settings'] as Record<string, unknown> | undefined ?? {}
  const settingsInputs = document.querySelectorAll<HTMLInputElement>('#panel-settings input')
  for (const settingInput of settingsInputs) {
    if (settingInput.id === 'clear-storage') continue
    const setting = settings.find((setting) => setting.name === settingInput.id)
    if (setting) {
      await setting.handleSave?.()
    } else {
      switch (settingInput.type) {
        case 'checkbox':
          savedSettings[settingInput.id] = settingInput.checked
          break
        // TODO hande radio buttons more gracefully
        case 'radio':
          const checkedRadioButton = document.querySelector<HTMLInputElement>(`#panel-settings input[name="${settingInput.name}"]:checked`)!
          savedSettings[settingInput.name] = checkedRadioButton.value
          break
      }
    }
  }
  await browser.storage.sync.set({ 'settings': savedSettings })

  // Shortcuts
  await saveShortcuts()

  saveButton.textContent = 'Saved ✅'
  setTimeout(() => saveButton.textContent = 'Save settings 💾', 3000)

}
saveButton.addEventListener('click', () => void saveSettings())

function addTabsAccessability(tablist: HTMLElement) {

  const tabs = tablist.querySelectorAll<HTMLElement>('[role="tab"]')
  const panels: HTMLElement[] = []
  tabs.forEach((tab) => {
    const tabControls = tab.getAttribute('aria-controls')!
    const tabPanel = document.querySelector<HTMLElement>(`#${tabControls}`)!
    panels.push(tabPanel)
  })

  let focusedTabIndex = 0

  tablist.addEventListener('keydown', (e) => {
    if (!(e.key === 'ArrowRight' || e.key === 'ArrowLeft')) return

    let step = 0
    if (e.key === 'ArrowRight') {
      if (focusedTabIndex + 1 >= tabs.length) return
      step = 1
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (e.key === 'ArrowLeft') {
      if (focusedTabIndex - 1 < 0) return
      step = -1
    }
    focusedTabIndex += step

    // select new tabs/panels
    tabs[focusedTabIndex].setAttribute('aria-selected', 'true')
    tabs[focusedTabIndex].setAttribute('tabindex', '0')
    tabs[focusedTabIndex].focus()
    panels[focusedTabIndex].hidden = false

    // unselect previous tabs/panel
    tabs[focusedTabIndex - step].setAttribute('aria-selected', 'false')
    tabs[focusedTabIndex - step].setAttribute('tabindex', '-1')
    panels[focusedTabIndex - step].hidden = true

  })

  tabs.forEach((tab, tabIndex) => tab.addEventListener('click', () => {
    if (tabIndex === focusedTabIndex) return

    tabs[tabIndex].setAttribute('aria-selected', 'true')
    tabs[tabIndex].setAttribute('tabindex', '0')
    tabs[tabIndex].focus()
    panels[tabIndex].hidden = false

    tabs[focusedTabIndex].setAttribute('aria-selected', 'false')
    tabs[focusedTabIndex].setAttribute('tabindex', '-1')
    panels[focusedTabIndex].hidden = true

    focusedTabIndex = tabIndex
  }))

}

// TODO this won't reset normal settings' inputs
// Clear storage callback
const clearStorageInput = document.querySelector<HTMLInputElement>('input#clear-storage')!
// eslint-disable-next-line @typescript-eslint/no-misused-promises
clearStorageInput.addEventListener('click', async () => {
  // Settings
  for (const setting of settings) {
    await setting.handleClear?.()
  }
  // Shortcuts
  await browser.storage.sync.clear()
  clearShortcuts()

  clearStorageInput.value = 'Cleared ✅'
  setTimeout(() => clearStorageInput.value = 'Clear', 3000)
})

await loadSettings()
await populateAllShortcuts()
selectFirstShortcutsTab()
const optionsTabs = document.querySelector<HTMLMenuElement>('menu#menu-options')!
addTabsAccessability(optionsTabs)
const sitesTabs = document.querySelector<HTMLMenuElement>('menu#menu-site-shortcuts')!
addTabsAccessability(sitesTabs)
