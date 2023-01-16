import Shortcuts from '../../shortcuts/Shortcuts'

import allShortcuts from '../../shortcuts/allShortcuts'

const tabpanelTemplate = document.querySelector<HTMLTemplateElement>('#tabpanel-template')!
const shortcutsSectionTemplate = document.querySelector<HTMLTemplateElement>('#shortcuts-section-template')!
const shortcutRowTemplate = document.querySelector<HTMLTemplateElement>('#shortcut-row-template')!

const shortcutsPanelsForms: HTMLFormElement[] = []

async function populateShortcuts(panelSiteShortcuts: HTMLElement, shortcuts: Shortcuts) {

  const tabpanel = tabpanelTemplate.content.cloneNode(true) as HTMLElement
  const form = tabpanel.querySelector<HTMLFormElement>('form[role="tabpanel"]')!
  form.id = `panel-shortcuts-${shortcuts.site}`
  form.setAttribute('aria-labelledby', `tab-shortcuts-${shortcuts.site}`)
  form.dataset.site = shortcuts.site
  panelSiteShortcuts.append(form)
  shortcutsPanelsForms.push(form)

  const shortcutsStorage = await browser.storage.sync.get(shortcuts.site)

  const inputs: HTMLInputElement[] = []
  for (const category of shortcuts.categories) {

    const shortcutsSection = shortcutsSectionTemplate.content.cloneNode(true) as HTMLElement
    const shortcutsFieldset = shortcutsSection.querySelector<HTMLFieldSetElement>('fieldset')!
    shortcutsFieldset.querySelector('legend')!.textContent = category.name
    form.append(shortcutsFieldset)

    for (const [shortcutName, shortcut] of category.shortcuts) {
      const shortcutRow = shortcutRowTemplate.content.cloneNode(true) as HTMLElement
      const label = shortcutRow.querySelector('label')!
      label.setAttribute('for', `${shortcuts.site}-${shortcutName}`)
      label.textContent = shortcut.description
      const input = shortcutRow.querySelector('input')!
      input.id = `${shortcuts.site}-${shortcutName}`
      input.dataset.shortcut = shortcutName
      input.setAttribute('placeholder', shortcut.defaultKey)
      input.value = (shortcutsStorage[shortcuts.site] as Record<string, string> | undefined)?.[shortcutName] ?? ''
      inputs.push(input)
      shortcutsFieldset.append(shortcutRow)
    }

  }
  setupCheckInputsUniqueness(inputs)

}

const tabTemplate = document.querySelector<HTMLTemplateElement>('#tab-template')!

export async function populateAllShortcuts() {
  const panelSiteShortcuts = document.querySelector<HTMLElement>('#panel-site-shortcuts')!
  const menuSiteShortcuts = document.querySelector<HTMLMenuElement>('menu#menu-site-shortcuts')!
  for (const shortcuts of allShortcuts) {

    const tab = tabTemplate.content.cloneNode(true) as HTMLElement
    const button = tab.querySelector('button')!
    button.textContent = shortcuts.site.replace(/^[a-z]|-[a-z]/g, (match) => match.replace('-', ' ').toUpperCase())
    button.id = `tab-shortcuts-${shortcuts.site}`
    button.setAttribute('aria-controls', `panel-shortcuts-${shortcuts.site}`)
    menuSiteShortcuts.append(tab)

    await populateShortcuts(panelSiteShortcuts, shortcuts)
  }
}

export function selectFirstShortcutsTab() {
  const firstTab = document.querySelector('menu#menu-site-shortcuts [role="tab"]')!
  firstTab.setAttribute('aria-selected', 'true')
  firstTab.setAttribute('tabindex', '0')

  const correspondingPanel = document.querySelector<HTMLElement>(`#${firstTab.getAttribute('aria-controls')!}`)!
  correspondingPanel.hidden = false
}

export async function saveShortcuts() {
  for (const form of shortcutsPanelsForms) {
    const newSiteShortcutsSettings: Record<string, string> = {}
    for (const input of form.querySelectorAll('input')) {
      if (!input.value) continue
      if (input.value.length !== 1) continue
      newSiteShortcutsSettings[input.dataset.shortcut!] = input.value
    }
    await browser.storage.sync.set({ [form.dataset.site!]: newSiteShortcutsSettings })
  }
}

export function clearShortcuts() {
  document.querySelectorAll<HTMLInputElement>('#panel-site-shortcuts input').forEach((shortcutInput) => {
    shortcutInput.value = ''
    // To update .duplicate classes
    shortcutInput.dispatchEvent(new InputEvent('input'))
  })
}

function setupCheckInputsUniqueness(inputs: HTMLInputElement[]) {

  const oldValues = new Map<HTMLInputElement, string>()
  const inputsByValues: Record<string, HTMLInputElement[]> = {}
  for (const input of inputs) {
    const inputValue = input.value || input.getAttribute('placeholder')!
    oldValues.set(input, inputValue)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    inputsByValues[inputValue] = inputsByValues[inputValue] ?? []
    inputsByValues[inputValue].push(input)
  }

  function checkInputsUniqueness() {
    for (const inputs of Object.values(inputsByValues)) {
      if (inputs.length === 1) inputs[0].classList.remove('duplicate')
      else inputs.forEach((input) => input.classList.add('duplicate'))
    }
  }

  checkInputsUniqueness()

  function onInputValueChange(event: Event) {
    const input = event.currentTarget as HTMLInputElement
    const newValue = input.value || input.getAttribute('placeholder')!
    const oldValue = oldValues.get(input)!
    if (oldValue === newValue) return

    const indexOfInput = inputsByValues[oldValue].indexOf(input)
    inputsByValues[oldValue].splice(indexOfInput, 1)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    inputsByValues[newValue] = inputsByValues[newValue] ?? []
    inputsByValues[newValue].push(input)
    oldValues.set(input, newValue)

    checkInputsUniqueness()
  }

  for (const input of inputs) {
    // Looking for 'change' event is enough, but 'input' event is more user friendly, although more costly
    input.addEventListener('input', onInputValueChange)
  }

}
