import Setting from './Setting'
import { extraGoogleDomains } from '../../../utils/extraDomains'

const setting = new Setting('google-run-on-all-domains')
export default setting

const settingInput = document.querySelector<HTMLInputElement>('#panel-settings #google-run-on-all-domains')!
setting.handleLoad = async () => {
  const allowedToRun = await browser.permissions.contains({
    origins: extraGoogleDomains
  })
  settingInput.checked = allowedToRun
}

async function handleSave() {
  if (settingInput.checked) {
    const isAllowed = await browser.permissions.request({
      origins: extraGoogleDomains
    })
    settingInput.checked = isAllowed
    if (!isAllowed) return
    await browser.runtime.sendMessage({
      type: 'registerGoogleDomainsContentScripts',
    })
  } else {
    await browser.permissions.remove({
      origins: extraGoogleDomains
    })
    await browser.runtime.sendMessage({
      type: 'unregisterGoogleDomainsContentScripts',
    })
  }
}

setting.handleSave = async () => {
  // It doesn't count as being called from a user input handler for some reason in options.ts
  // await handleSave()
}

// For now, handle saving when the user click on the input
settingInput.addEventListener('click', () => void handleSave())

setting.handleClear = async () => {
  await browser.permissions.remove({
    origins: extraGoogleDomains
  })
  await browser.runtime.sendMessage({
    type: 'unregisterGoogleDomainsContentScripts',
  })
  settingInput.checked = false
}
