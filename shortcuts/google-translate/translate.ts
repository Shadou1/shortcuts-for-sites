import { ShortcutsCategory } from '../Shortcuts'

const category = new ShortcutsCategory('Translate', 'Translate')
export default category

const translateFromTextarea = document.querySelector<HTMLTextAreaElement>('textarea.er8xn')!
category.shortcuts.set('focusTranslateFromBox', {
  defaultKey: 'j',
  description: 'Focus translate-from box',
  event: (ev) => {
    // because 'keydown' event listener in init.ts is capturing,
    // without ev.preventDefault() the j letter will be typed in a textarea when using this shortcut
    ev.preventDefault()
    translateFromTextarea.focus()
    window.scrollTo({ top: 0 })
  }
})

category.shortcuts.set('unfocusTranslateFromBox', {
  defaultKey: 'Escape',
  description: 'Unfocus translate-from box',
  ignoreInput: true,
  event: () => {
    (document.activeElement as HTMLElement | null)?.blur()
  }
})

let sourceLanguageTablist: HTMLElement | null
let translateLanguageTablist: HTMLElement | null
function updateLanguageTablists() {
  if (sourceLanguageTablist?.offsetParent && translateLanguageTablist?.offsetParent) return
  const languageTablists = document.querySelectorAll<HTMLElement>('c-wiz[data-node-index="3;0"] [role="tablist"]')
  sourceLanguageTablist = languageTablists[0]
  translateLanguageTablist = languageTablists[1]
}

category.shortcuts.set('focusSourceLanguage', {
  defaultKey: 'u',
  description: 'Focus source languages',
  event: () => {
    updateLanguageTablists()
    sourceLanguageTablist?.querySelector<HTMLElement>('button[aria-selected="true"]')?.focus()
  }
})

category.shortcuts.set('focusTranslateLanguage', {
  defaultKey: 'o',
  description: 'Focus translation languages',
  event: () => {
    updateLanguageTablists()
    translateLanguageTablist?.querySelector<HTMLElement>('button[aria-selected="true"]')?.focus()
  }
})

let swapLanguagesButton: HTMLButtonElement | null
category.shortcuts.set('swapLanguages', {
  defaultKey: 'i',
  description: 'Swap languages',
  event: (ev) => {
    // swapping languages automatically puts the cursor in the translate-from textarea
    ev.preventDefault()
    swapLanguagesButton = swapLanguagesButton?.offsetParent ? swapLanguagesButton : document.querySelector<HTMLButtonElement>('c-wiz[data-node-index="1;0"] c-wiz[data-node-index="3;0"] button[jslog]')
    swapLanguagesButton?.click()
  }
})
