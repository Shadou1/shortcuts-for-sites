const translateFromTextarea = document.querySelector('textarea[aria-label="Source text"]')

let showDefinitionsDiv, hideDefinitionsDiv
let showExamplesDiv, hideExamplesDiv
let showTranslationsDiv, hideTranslationsDiv

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

const hotkeys = {

  'j': {
    category: 'General',
    description: 'Focus translate-from box',
    event: () => {
      translateFromTextarea.focus()
      window.scrollTo({ top: 0})
    }
  },

  'd': {
    category: 'General',
    description: 'Show/hide definitions',
    event: () => {
      getDivs()
      if (showDefinitionsDiv.offsetParent) showDefinitionsDiv.click()
      else hideDefinitionsDiv.click()
    }
  },

  'e': {
    category: 'General',
    description: 'Show/hide examples',
    event: () => {
      getDivs()
      if (showExamplesDiv.offsetParent) showExamplesDiv.click()
      else hideExamplesDiv.click()
    }
  },

  't': {
    category: 'General',
    description: 'Show/hide translations',
    event: () => {
      getDivs()
      if (showTranslationsDiv.offsetParent) showTranslationsDiv.click()
      else hideTranslationsDiv.click()
    }
  },

}

Object.assign(keyboardOnlyNavigation.hotkeys, hotkeys)
