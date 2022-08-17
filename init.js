let isHotkeysAvailable = false

var keyboardOnlyNavigation = {
  _hotkeys: {},
  hotkeys: {},
}

function hotkeysToSerializable(hotkeys) {
  const hotkeysSerialized = {}
  Object.entries(hotkeys).forEach(([hotkey, { category, description, verbatum }]) => {
    hotkeysSerialized[hotkey] = {
      category,
      description,
      verbatum
    }
  })
  return hotkeysSerialized
}

const hotkeysProxyHandler = {
  set(target, prop, value) {

    if (!isHotkeysAvailable) {
      browser.runtime.sendMessage({
        type: 'isHotkeysAvailable',
        isHotkeysAvailable: true
      })
      isHotkeysAvailable = true
    }

    // browser.runtime.sendMessage({
    //   type: 'hotkeyAdded',
    //   hotkeyInfo: [prop, value[0]],
    // })

    return Reflect.set(target, prop, value)
  }
}
keyboardOnlyNavigation.hotkeys = new Proxy(keyboardOnlyNavigation._hotkeys, hotkeysProxyHandler)

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'getHotkeys':
      sendResponse({
        type: 'hotkeys',
        hotkeys: hotkeysToSerializable(keyboardOnlyNavigation.hotkeys)
      })
      break
  }
})

// Wont work if activeElement is not an input or textarea but still accepts 'input' event
// document.addEventListener('keydown', (ev) => {
  
//   const activeElement = document.activeElement
//   if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) return
  
//   const hotkeyConf = keyboardOnlyNavigation.hotkeys[ev.key]
//   if (!hotkeyConf) return
//   if (!!hotkeyConf.ctrlKey !== ev.ctrlKey) return
//   if (!!hotkeyConf.altKey !== ev.altKey) return

//   hotkeyConf.event(ev)
  
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


    const hotkeyConf = keyboardOnlyNavigation.hotkeys[ev.key]
    if (!hotkeyConf) return
    if (!!hotkeyConf.ctrlKey !== ev.ctrlKey) return
    if (!!hotkeyConf.altKey !== ev.altKey) return

    hotkeyConf.event(ev)

  }, 10)

})
