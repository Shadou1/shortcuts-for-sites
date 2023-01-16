import { ShortcutsCategory } from '../Shortcuts'

const category = new ShortcutsCategory('Details', 'Translation details')
export default category

let listenSourceButton: HTMLButtonElement | null
let listenTranslationButton: HTMLButtonElement | null

function updateListenButtons() {
  if (listenSourceButton?.offsetParent && listenTranslationButton?.offsetParent) return
  const listenButtons = document.querySelectorAll<HTMLButtonElement>('[data-is-tooltip-wrapper="true"] button[data-tooltip-label-on]')
  listenSourceButton = listenButtons[0]
  listenTranslationButton = listenButtons[1]
}

category.shortcuts.set('listenToSource', {
  defaultKey: 'k',
  description: 'Listen to source text',
  event: () => {
    updateListenButtons()
    listenSourceButton?.click()
  }
})

category.shortcuts.set('listenToTranslation', {
  defaultKey: 'l',
  description: 'Listen to translation',
  event: () => {
    updateListenButtons()
    listenTranslationButton?.click()
  }
})

let showDefinitionsDiv: HTMLDivElement, hideDefinitionsDiv: HTMLDivElement
let showExamplesDiv: HTMLDivElement, hideExamplesDiv: HTMLDivElement
let showTranslationsDiv : HTMLDivElement, hideTranslationsDiv: HTMLDivElement

// TODO make this function less expensive
function getDivs() {

  const translationDivs = document.querySelectorAll<HTMLDivElement>('c-wiz[role="region"][data-node-index="1;0"] > div > div > div')
  let leftDiv = null
  let rightDiv = null
  if (translationDivs[0].offsetParent) {
    leftDiv = translationDivs[1]
    rightDiv = translationDivs[0]
  } else {
    leftDiv = translationDivs[1]
    rightDiv = translationDivs[2]
  }

  showDefinitionsDiv = leftDiv.querySelector<HTMLDivElement>('div > div > div:nth-child(2) > div[aria-expanded="false"]')!
  showExamplesDiv = leftDiv.querySelector<HTMLDivElement>('div:nth-child(2) > div > div:nth-child(2) > div[aria-expanded="false"]')!
  showTranslationsDiv = rightDiv.querySelector<HTMLDivElement>('div > div > div:nth-child(2) > div[aria-expanded="false"]')!

  hideDefinitionsDiv = leftDiv.querySelector<HTMLDivElement>('div > div > div:nth-child(2) > div[aria-expanded="true"]')!
  hideExamplesDiv = leftDiv.querySelector<HTMLDivElement>('div:nth-child(2) > div > div:nth-child(2) > div[aria-expanded="true"]')!
  hideTranslationsDiv = rightDiv.querySelector<HTMLDivElement>('div > div > div:nth-child(2) > div[aria-expanded="true"]')!

}

category.shortcuts.set('showDefinitions', {
  defaultKey: 'd',
  description: 'Show/hide definitions',
  event: () => {
    getDivs()
    // const showDefinitionsDivRect = showDefinitionsDiv.getBoundingClientRect()
    // window.scrollBy(0, showDefinitionsDivRect.top - 200)
    if (showDefinitionsDiv.offsetParent) showDefinitionsDiv.click()
    else hideDefinitionsDiv.click()
  }
})

category.shortcuts.set('showExamples', {
  defaultKey: 'e',
  description: 'Show/hide examples',
  event: () => {
    getDivs()
    // const showExamplesDivRect = showExamplesDiv.getBoundingClientRect()
    // window.scrollBy(0, showExamplesDivRect.top - 200)
    if (showExamplesDiv.offsetParent) showExamplesDiv.click()
    else hideExamplesDiv.click()
  }
})

category.shortcuts.set('showTranslations', {
  defaultKey: 't',
  description: 'Show/hide translations',
  event: () => {
    getDivs()
    // const showTranslationsDivRect = showTranslationsDiv.getBoundingClientRect()
    // window.scrollBy(0, showTranslationsDivRect.top - 200)
    if (showTranslationsDiv.offsetParent) showTranslationsDiv.click()
    else hideTranslationsDiv.click()
  }
})
