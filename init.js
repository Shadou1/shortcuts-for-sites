var keyboardOnlyNavigation = {}
keyboardOnlyNavigation.hotkeys = {}

let isLastInputEvent = false
document.addEventListener('input', (ev) => {
  let = isLastInputEvent = true
})

let lastTimeout = null
document.addEventListener('keydown', (ev) => {

  clearTimeout(lastTimeout)
  // Execute event listener after a timeout to ensure that it is not firing together with an input event
  lastTimeout = setTimeout(() => {

    if (isLastInputEvent) {
      isLastInputEvent = false
      return
    }
  
    keyboardOnlyNavigation.hotkeys[ev.key]?.(ev)

  }, 10)

})