let isShortcutsAvailable = false

var keyboardOnlyNavigation = {
  _shortcuts: {},
  shortcuts: {},
}

function shortcutsToSerializable(shortcuts) {
  const shortcutsSerialized = {}
  Object.entries(shortcuts).forEach(([shortcut, { category, description, verbatum }]) => {
    shortcutsSerialized[shortcut] = {
      category,
      description,
      verbatum
    }
  })
  return shortcutsSerialized
}

const shortcutsProxyHandler = {
  set(target, prop, value) {

    if (!isShortcutsAvailable) {
      browser.runtime.sendMessage({
        type: 'isShortcutsAvailable',
        isShortcutsAvailable: true
      })
      isShortcutsAvailable = true
    }

    // browser.runtime.sendMessage({
    //   type: 'shortcutAdded',
    //   shortcutInfo: [prop, value[0]],
    // })

    return Reflect.set(target, prop, value)
  }
}
keyboardOnlyNavigation.shortcuts = new Proxy(keyboardOnlyNavigation._shortcuts, shortcutsProxyHandler)


// Browser action asks for shortcuts for the current page
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'getShortcuts':
      sendResponse({
        type: 'shortcuts',
        shortcuts: shortcutsToSerializable(keyboardOnlyNavigation.shortcuts)
      })
      break
  }
})

// Handle shortcuts

// Wont work if activeElement is not an input or textarea, but still accepts 'input' event
// document.addEventListener('keydown', (ev) => {

//   const activeElement = document.activeElement
//   if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) return

//   const shortcutConf = keyboardOnlyNavigation.shortcuts[ev.key]
//   if (!shortcutConf) return
//   if (!!shortcutConf.ctrlKey !== ev.ctrlKey) return
//   if (!!shortcutConf.altKey !== ev.altKey) return

//   shortcutConf.event(ev)

// })

let isLastInputEvent = false
document.addEventListener('input', (_ev) => {
  isLastInputEvent = true
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


    const shortcutConf = keyboardOnlyNavigation.shortcuts[ev.key]
    if (!shortcutConf) return
    if (ev.ctrlKey) shortcutConf.ctrlEvent?.(ev)
    else if (ev.altKey) shortcutConf.altEvent?.(ev)
    else shortcutConf.event(ev)

  }, 10)

})
