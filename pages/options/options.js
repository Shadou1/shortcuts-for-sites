const saveButton = document.querySelector('#save-settings-button')

// These are not saved in browser.storage.sync
const specialSettings = [
  'google-run-on-all-domains',
  'clear-storage'
]

let extraGoogleDomains

// TODO rewrite this
async function loadSettings() {
  const settingInputGoogleRunOnAllDomains = document.querySelector('#panel-settings #google-run-on-all-domains')
  const allowedToRun = await handleLoadGoogleRunOnAllDomainsSetting()
  settingInputGoogleRunOnAllDomains.checked = allowedToRun

  const settings = await browser.storage.sync.get('settings')
  if (!settings['settings']) return
  Object.entries(settings['settings']).forEach(([setting, value]) => {

    if (specialSettings.indexOf(setting) !== -1) return
    const settingInput = document.querySelector(`#panel-settings input#${setting}`)
    if (!settingInput) return

    switch (settingInput.type) {
      case 'checkbox':
        settingInput.checked = value
        break
    }

  })
}

async function handleLoadGoogleRunOnAllDomainsSetting() {
  const allowedToRun = await browser.permissions.contains({
    origins: extraGoogleDomains
  })
  return allowedToRun
}

const siteShortcutsPanelsForms = []

const tabTemplate = document.querySelector('#tab-template')
const tabpanelTemplate = document.querySelector('#tabpanel-template')
const siteShortcutsSectionTemplate = document.querySelector('#shortcuts-section-template')
const siteShortcutTemplate = document.querySelector('#shortcut-template')

function setupCheckInputsUniqueness(inputs) {

  const oldValues = new Map()
  const inputsByValues = {}
  for (const input of inputs) {
    const inputValue = input.value || input.getAttribute('placeholder')
    oldValues.set(input, inputValue)
    inputsByValues[inputValue] = inputsByValues[inputValue] || []
    inputsByValues[inputValue].push(input)
  }

  function checkInputsUniqueness() {
    for (const inputs of Object.values(inputsByValues)) {
      if (inputs.length === 1) inputs[0].classList.remove('duplicate')
      else inputs.forEach((input) => input.classList.add('duplicate'))
    }
  }

  checkInputsUniqueness()

  function onInputValueChange(event) {
    const input = event.currentTarget
    const newValue = input.value || input.getAttribute('placeholder')
    const oldValue = oldValues.get(input)
    if (oldValue === newValue) return

    const indexOfInput = inputsByValues[oldValue].indexOf(input)
    inputsByValues[oldValue].splice(indexOfInput, 1)
    inputsByValues[newValue] = inputsByValues[newValue] || []
    inputsByValues[newValue].push(input)
    oldValues.set(input, newValue)

    checkInputsUniqueness()
  }

  for (const input of inputs) {
    // Looking for 'change' event is enough, but 'input' event is more user friendly, although more costly
    input.addEventListener('input', onInputValueChange)
  }

}

async function populateSiteShortcuts(panelSiteShortcuts, pathToShortcuts, tabId) {

  const tabpanel = tabpanelTemplate.content.cloneNode(true)
  const form = tabpanel.querySelector('form[role="tabpanel"]')
  form.id = `panel-shortcuts-${tabId}`
  form.setAttribute('aria-labelledby', `tab-shortcuts-${tabId}`)
  form.dataset.site = tabId
  panelSiteShortcuts.append(form)
  siteShortcutsPanelsForms.push(form)

  const shortcutsStorage = await browser.storage.sync.get(tabId)
  const { shortcuts } = await import(browser.runtime.getURL(pathToShortcuts))

  const inputs = []
  let lastCategory = null
  let shortcutsFieldset = null
  for (const [shortcutName, { category, description, defaultKey }] of shortcuts) {

    if (category !== lastCategory) {
      lastCategory = category
      const shortcutsSection = siteShortcutsSectionTemplate.content.cloneNode(true)
      shortcutsFieldset = shortcutsSection.querySelector('fieldset')
      shortcutsFieldset.querySelector('legend').textContent = category
      form.append(shortcutsFieldset)
    }

    const shortcut = siteShortcutTemplate.content.cloneNode(true)

    const label = shortcut.querySelector('label')
    label.setAttribute('for', `${tabId}-${shortcutName}`)
    label.textContent = description

    const input = shortcut.querySelector('input')
    input.id = `${tabId}-${shortcutName}`
    input.dataset.shortcut = shortcutName
    input.setAttribute('placeholder', defaultKey)
    input.value = shortcutsStorage?.[tabId]?.[shortcutName] || ''
    inputs.push(input)

    shortcutsFieldset.append(shortcut)

  }

  setupCheckInputsUniqueness(inputs)

}

async function populateAllSiteShortcuts() {
  const panelSiteShortcuts = document.querySelector('#panel-site-shortcuts')
  const menuSiteShortcuts = document.querySelector('menu#menu-site-shortcuts')
  const { siteMatches } = await import(browser.runtime.getURL('shortcuts/siteMatches.js'))
  for (const [site, { path }] of Object.entries(siteMatches)) {
    const tabId = site

    const tab = tabTemplate.content.cloneNode(true)
    const button = tab.querySelector('button')
    button.textContent = site.replace(/^[a-z]|-[a-z]/g, (match) => match.replace('-', ' ').toUpperCase())
    button.id = `tab-shortcuts-${tabId}`
    button.setAttribute('aria-controls', `panel-shortcuts-${tabId}`)
    menuSiteShortcuts.append(tab)

    await populateSiteShortcuts(panelSiteShortcuts, path, tabId)
  }
}

function selectFirstSiteShortcutsTab() {
  const firstTab = document.querySelector('menu#menu-site-shortcuts [role="tab"]')
  firstTab.setAttribute('aria-selected', true)
  firstTab.setAttribute('tabindex', 0)

  const correspondingPanel = document.querySelector(`#${firstTab.getAttribute('aria-controls')}`)
  correspondingPanel.hidden = false
}

function addTabsAccessability(tablist) {

  const tabs = tablist.querySelectorAll('[role="tab"]')
  const panels = []
  tabs.forEach((tab) => {
    const tabControls = tab.getAttribute('aria-controls')
    const tabPanel = document.querySelector(`#${tabControls}`)
    panels.push(tabPanel)
  })

  let focusedTabIndex = 0

  tablist.addEventListener('keydown', (e) => {
    if (!(e.key === 'ArrowRight' || e.key === 'ArrowLeft')) return

    let step
    if (e.key === 'ArrowRight') {
      if (focusedTabIndex + 1 >= tabs.length) return
      step = 1
    } else if (e.key === 'ArrowLeft') {
      if (focusedTabIndex - 1 < 0) return
      step = -1
    }
    focusedTabIndex += step

    // select new tabs/panels
    tabs[focusedTabIndex].setAttribute('aria-selected', true)
    tabs[focusedTabIndex].setAttribute('tabindex', '0')
    tabs[focusedTabIndex].focus()
    panels[focusedTabIndex].hidden = false

    // unselect previous tabs/panel
    tabs[focusedTabIndex - step].setAttribute('aria-selected', false)
    tabs[focusedTabIndex - step].setAttribute('tabindex', '-1')
    panels[focusedTabIndex - step].hidden = true

  })

  tabs.forEach((tab, tabIndex) => tab.addEventListener('click', () => {
    if (tabIndex === focusedTabIndex) return

    tabs[tabIndex].setAttribute('aria-selected', true)
    tabs[tabIndex].setAttribute('tabindex', '0')
    tabs[tabIndex].focus()
    panels[tabIndex].hidden = false

    tabs[focusedTabIndex].setAttribute('aria-selected', false)
    tabs[focusedTabIndex].setAttribute('tabindex', '-1')
    panels[focusedTabIndex].hidden = true

    focusedTabIndex = tabIndex
  }))

}

(async () => {
  ({ extraGoogleDomains } = await import(browser.runtime.getURL('utils/extraDomains.js')))
  await loadSettings()
  await populateAllSiteShortcuts()
  selectFirstSiteShortcutsTab()
  const optionsTabs = document.querySelector('menu#menu-options')
  addTabsAccessability(optionsTabs)
  const sitesTabs = document.querySelector('menu#menu-site-shortcuts')
  addTabsAccessability(sitesTabs)
})()

async function handleSaveGoogleRunOnAllDomainsSetting(settingInput) {
  if (settingInput.checked) {
    const isAllowed = await browser.permissions.request({
      origins: extraGoogleDomains
    })
    settingInput.checked = isAllowed
    if (!isAllowed) return
    await browser.runtime.sendMessage({
      type: 'registerGoogleDomainsContentScripts',
    })
  } else {
    await browser.permissions.remove({
      origins: extraGoogleDomains
    })
    await browser.runtime.sendMessage({
      type: 'unregisterGoogleDomainsContentScripts',
    })
  }
}

// Clear storage callback
document.querySelector('input#clear-storage').addEventListener('click', async (e) => {
  await browser.permissions.remove({
    origins: extraGoogleDomains
  })
  await browser.runtime.sendMessage({
    type: 'unregisterGoogleDomainsContentScripts',
  })
  document.querySelector('#panel-settings input#google-run-on-all-domains').checked = false

  await browser.storage.sync.clear()
  document.querySelectorAll('#panel-site-shortcuts input').forEach((shortcutInput) => {
    shortcutInput.value = ''
    // To update .duplicate classes
    shortcutInput.dispatchEvent(new InputEvent('input'))
  })
  e.target.value = 'Cleared ✅'
  setTimeout(() => e.target.value = 'Clear', 3000)
})

const specialSettingsSaveHandlers = {
  'google-run-on-all-domains': handleSaveGoogleRunOnAllDomainsSetting
}

async function saveSettings() {

  // Settings
  const newSettings = {}
  const settingsInputs = document.querySelectorAll('#panel-settings input')
  for (const settingInput of settingsInputs) {
    if (specialSettings.indexOf(settingInput.id) !== -1) {
      await specialSettingsSaveHandlers[settingInput.id]?.(settingInput)
    } else {
      switch (settingInput.type) {
        case 'checkbox':
          newSettings[settingInput.id] = settingInput.checked
          break
      }
    }
  }
  await browser.storage.sync.set({ 'settings': newSettings })

  // Shortcuts
  for (const form of siteShortcutsPanelsForms) {
    const newSiteShortcutsSettings = {}
    for (const input of form.querySelectorAll('input')) {
      if (!input.value) continue
      if (input.value.length !== 1) continue
      newSiteShortcutsSettings[input.dataset.shortcut] = input.value
    }
    await browser.storage.sync.set({ [form.dataset.site]: newSiteShortcutsSettings })
  }

  saveButton.textContent = 'Saved ✅'
  setTimeout(() => saveButton.textContent = 'Save settings 💾', 3000)

}

saveButton.addEventListener('click', async () => await saveSettings())
