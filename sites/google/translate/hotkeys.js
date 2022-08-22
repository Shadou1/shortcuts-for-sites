const translateFromTextarea = document.querySelector('textarea[aria-label="Source text"]')

const hotkeys = {

  'j': {
    category: 'General',
    description: 'Focus translate-from box',
    event: () => {
      translateFromTextarea.focus()
    }
  }

}

Object.assign(keyboardOnlyNavigation.hotkeys, hotkeys)