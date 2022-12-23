const translateFromTextarea = document.querySelector('textarea.er8xn')

let showDefinitionsDiv, hideDefinitionsDiv
let showExamplesDiv, hideExamplesDiv
let showTranslationsDiv, hideTranslationsDiv

let sourceLanguageTablist, translateLanguageTablist
let swapLanguagesButton
let listenSourceButton, listenTranslationButton

// TODO make this function less expensive
function getDivs() {

  const translationDivs = document.querySelectorAll('c-wiz[role="region"][data-node-index="1;0"] > div > div > div')
  let leftDiv = null
  let rightDiv = null
  if (translationDivs[0].offsetParent) {
    leftDiv = translationDivs[1]
    rightDiv = translationDivs[0]
  } else {
    leftDiv = translationDivs[1]
    rightDiv = translationDivs[2]
  }

  showDefinitionsDiv = leftDiv.querySelector('div > div > div:nth-child(2) > div[aria-expanded="false"]')
  showExamplesDiv = leftDiv.querySelector('div:nth-child(2) > div > div:nth-child(2) > div[aria-expanded="false"]')
  showTranslationsDiv = rightDiv.querySelector('div > div > div:nth-child(2) > div[aria-expanded="false"]')

  hideDefinitionsDiv = leftDiv.querySelector('div > div > div:nth-child(2) > div[aria-expanded="true"]')
  hideExamplesDiv = leftDiv.querySelector('div:nth-child(2) > div > div:nth-child(2) > div[aria-expanded="true"]')
  hideTranslationsDiv = rightDiv.querySelector('div > div > div:nth-child(2) > div[aria-expanded="true"]')

}

function updateLanguageTablists() {
  if (sourceLanguageTablist?.offsetParent && translateLanguageTablist?.offsetParent) return
  const languageTablists = document.querySelectorAll('c-wiz[data-node-index="3;0"] [role="tablist"]')
  sourceLanguageTablist = languageTablists[0]
  translateLanguageTablist = languageTablists[1]
}

function updateListenButtons() {
  if (listenSourceButton?.offsetParent && listenTranslationButton?.offsetParent) return
  const listenButtons = document.querySelectorAll('[data-is-tooltip-wrapper="true"] button[data-tooltip-label-on]')
  listenSourceButton = listenButtons[0]
  listenTranslationButton = listenButtons[1]
}

export const shortcuts = new Map()

shortcuts.set('focusTranslateFromBox', {
  category: 'Translate',
  defaultKey: 'j',
  description: 'Focus translate-from box',
  event: () => {
    translateFromTextarea.focus()
    window.scrollTo({ top: 0 })
  }
})

shortcuts.set('unfocusTranslateFromBox', {
  category: 'Translate',
  defaultKey: 'Escape',
  description: 'Unfocus translate-from box',
  event: () => {
    document.activeElement.blur()
  }
})

shortcuts.set('focusSourceLanguage', {
  category: 'Translate',
  defaultKey: 'u',
  description: 'Focus source languages',
  event: () => {
    updateLanguageTablists()
    sourceLanguageTablist?.querySelector('button[aria-selected="true"]')?.focus()
  }
})

shortcuts.set('focusTranslateLanguage', {
  category: 'Translate',
  defaultKey: 'o',
  description: 'Focus translation languages',
  event: () => {
    updateLanguageTablists()
    translateLanguageTablist?.querySelector('button[aria-selected="true"]')?.focus()
  }
})

shortcuts.set('swapLanguages', {
  category: 'Translate',
  defaultKey: 'i',
  description: 'Swap languages',
  event: () => {
    swapLanguagesButton = swapLanguagesButton?.offsetParent ? swapLanguagesButton : document.querySelector('[__is_owner="true"] button[jslog]')
    swapLanguagesButton?.click()
  }
})

shortcuts.set('listenToSource', {
  category: 'Details',
  defaultKey: 'k',
  description: 'Listen to source text',
  event: () => {
    updateListenButtons()
    listenSourceButton?.click()
  }
})

shortcuts.set('listenToTranslation', {
  category: 'Details',
  defaultKey: 'l',
  description: 'Listen to translation',
  event: () => {
    updateListenButtons()
    listenTranslationButton?.click()
  }
})

shortcuts.set('showDefinitions', {
  category: 'Details',
  defaultKey: 'd',
  description: 'Show/hide definitions',
  event: () => {
    getDivs()
    // setTimeout(() => {
    //   showDefinitionsDiv.parentElement.parentElement.scrollIntoView()
    //   window.scrollBy(0, -100)
    // }, 100)
    if (showDefinitionsDiv.offsetParent) showDefinitionsDiv.click()
    else hideDefinitionsDiv.click()
  }
})

shortcuts.set('showExamples', {
  category: 'Details',
  defaultKey: 'e',
  description: 'Show/hide examples',
  event: () => {
    getDivs()
    // setTimeout(() => {
    //   showExamplesDiv.parentElement.parentElement.scrollIntoView()
    //   window.scrollBy(0, -100)
    // }, 100)
    if (showExamplesDiv.offsetParent) showExamplesDiv.click()
    else hideExamplesDiv.click()
  }
})

shortcuts.set('showTranslations', {
  category: 'Details',
  defaultKey: 't',
  description: 'Show/hide translations',
  event: () => {
    getDivs()
    // setTimeout(() => {
    //   showTranslationsDiv.parentElement.parentElement.scrollIntoView()
    //   window.scrollBy(0, -100)
    // }, 100)
    if (showTranslationsDiv.offsetParent) showTranslationsDiv.click()
    else hideTranslationsDiv.click()
  }
})
