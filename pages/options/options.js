// TODO get these from a common place
const shortcutsPaths = {
  'google-search': 'shortcuts/google/search/shortcuts.js',
  'google-translate': 'shortcuts/google/translate/shortcuts.js',
  'youtube': 'shortcuts/youtube/shortcuts.js',
  'twitch': 'shortcuts/twitch/shortcuts.js',
  'reddit': 'shortcuts/reddit/shortcuts.js',
}

const main = document.querySelector('main')
const tablistMenu = document.querySelector('menu[role="tablist"]')
const saveButton = document.querySelector('#save-settings-button')

const tabTemplate = document.querySelector('#tab-template')
const tabpanelTemplate = document.querySelector('#tabpanel-template')
const shortcutsSectionTemplate = document.querySelector('#shortcuts-section-template')
const shortcutTemplate = document.querySelector('#shortcut-template')

const tabsButtons = []
const panelsForms = []

async function populateShortcuts(path, tabId) {

  const tabpanel = tabpanelTemplate.content.cloneNode(true)
  const form = tabpanel.querySelector('form[role="tabpanel"]')
  form.id = `panel-${tabId}`
  form.setAttribute('aria-labelledby', `tab-${tabId}`)
  form.dataset.site = tabId
  main.append(form)
  panelsForms.push(form)

  const shortcutsStorage = await browser.storage.sync.get(tabId)
  const { shortcuts } = await import(browser.runtime.getURL(path))

  let lastCategory = null
  let shortcutsFieldset = null
  for (const [shortcutName, { category, description, defaultKey }] of shortcuts) {

    if (category !== lastCategory) {
      lastCategory = category
      const shortcutsSection = shortcutsSectionTemplate.content.cloneNode(true)
      shortcutsFieldset = shortcutsSection.querySelector('fieldset')
      shortcutsFieldset.querySelector('legend').textContent = category
      form.append(shortcutsFieldset)
    }

    const shortcut = shortcutTemplate.content.cloneNode(true)

    const label = shortcut.querySelector('label')
    label.setAttribute('for', `${tabId}-${shortcutName}`)
    label.textContent = description

    const input = shortcut.querySelector('input')
    input.id = `${tabId}-${shortcutName}`
    input.dataset.shortcut = shortcutName
    input.setAttribute('placeholder', defaultKey)
    input.value = shortcutsStorage?.[tabId]?.[shortcutName] || ''

    shortcutsFieldset.append(shortcut)

  }

}

async function populateAllShortcuts() {
  for (const [site, path] of Object.entries(shortcutsPaths)) {

    const tabId = site

    const tab = tabTemplate.content.cloneNode(true)
    const button = tab.querySelector('button')
    button.textContent = site.replace(/^[a-z]|-[a-z]/g, (match) => match.replace('-', ' ').toUpperCase())
    button.id = `tab-${tabId}`
    button.setAttribute('aria-controls', `panel-${tabId}`)
    tablistMenu.append(tab)

    tabsButtons.push(button)
    button.dataset.tabIndex = tabsButtons.length - 1

    await populateShortcuts(path, tabId)

  }
}

function initializeShortcuts() {
  const firstTab = document.querySelector('[role="tab"]')
  firstTab.setAttribute('aria-selected', true)
  firstTab.setAttribute('tabindex', 0)

  const correspondingPanel = document.querySelector(`#${firstTab.getAttribute('aria-controls')}`)
  correspondingPanel.hidden = false
}

function addKeyboardAccessability() {
  let focusedTabIndex = 0

  tablistMenu.addEventListener('keydown', (e) => {
    if (!(e.key === 'ArrowRight' || e.key === 'ArrowLeft')) return

    let step
    if (e.key === 'ArrowRight') {
      if (focusedTabIndex + 1 >= tabsButtons.length) return
      step = 1
    } else if (e.key === 'ArrowLeft') {
      if (focusedTabIndex - 1 < 0) return
      step = -1
    }
    focusedTabIndex += step

    // select new tabs/panels
    tabsButtons[focusedTabIndex].setAttribute('aria-selected', true)
    tabsButtons[focusedTabIndex].setAttribute('tabindex', '0')
    tabsButtons[focusedTabIndex].focus()
    panelsForms[focusedTabIndex].hidden = false


    // unselect previous tabs/panel
    tabsButtons[focusedTabIndex - step].setAttribute('aria-selected', false)
    tabsButtons[focusedTabIndex - step].setAttribute('tabindex', '-1')
    panelsForms[focusedTabIndex - step].hidden = true

  })

  tabsButtons.forEach((button) => button.addEventListener('click', (e) => {
    const clickedIndex = +e.currentTarget.dataset.tabIndex
    if (clickedIndex === focusedTabIndex) return

    tabsButtons[clickedIndex].setAttribute('aria-selected', true)
    tabsButtons[clickedIndex].setAttribute('tabindex', '0')
    tabsButtons[clickedIndex].focus()
    panelsForms[clickedIndex].hidden = false

    tabsButtons[focusedTabIndex].setAttribute('aria-selected', false)
    tabsButtons[focusedTabIndex].setAttribute('tabindex', '-1')
    panelsForms[focusedTabIndex].hidden = true

    focusedTabIndex = clickedIndex
  }))

}

(async () => {
  await populateAllShortcuts()
  initializeShortcuts()
  addKeyboardAccessability()
})()

async function saveSettings() {

  for (const form of panelsForms) {
    const newSettings = {}
    for (const input of form.querySelectorAll('input')) {
      if (!input.value) continue
      if (input.value.length !== 1) continue
      newSettings[input.dataset.shortcut] = input.value
    }
    await browser.storage.sync.set({[form.dataset.site]: newSettings})
  }

}

saveButton.addEventListener('click', async () => await saveSettings())
