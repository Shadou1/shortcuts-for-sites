import { ShortcutsCategory } from '../Shortcuts'

const category = new ShortcutsCategory('Stream', 'Stream')
export default category

let settingsButton: HTMLButtonElement | null
let qualityButton: HTMLButtonElement | null
category.shortcuts.set('openVideoSettings', {
  defaultKey: 's',
  description: 'Open settings',
  isAvailable: () => {
    const allSettingsButtons = document.querySelectorAll<HTMLButtonElement>('#channel-player button[data-a-target="player-settings-button"]')
    if (!allSettingsButtons.length) return false
    settingsButton = allSettingsButtons[allSettingsButtons.length - 1]
    return settingsButton.offsetParent
  },
  event: () => {
    settingsButton!.click()
    // qualityButton = qualityButton || document.querySelector('div[data-a-target="player-settings-menu"] button[data-a-target="player-settings-menu-item-quality"]')
    qualityButton = document.querySelector<HTMLButtonElement>('div[data-a-target="player-settings-menu"] button[data-a-target="player-settings-menu-item-quality"]')!
    qualityButton.focus()
  }
})

category.shortcuts.set('openVideoQualitySettings', {
  defaultKey: 'q',
  description: 'Open quality settings',
  isAvailable: () => {
    const allSettingsButtons = document.querySelectorAll<HTMLButtonElement>('#channel-player button[data-a-target="player-settings-button"]')
    if (!allSettingsButtons.length) return false
    settingsButton = allSettingsButtons[allSettingsButtons.length - 1]
    return settingsButton.offsetParent
  },
  event: () => {
    settingsButton!.click()
    qualityButton = document.querySelector<HTMLButtonElement>('div[data-a-target="player-settings-menu"] button[data-a-target="player-settings-menu-item-quality"]')!
    qualityButton.click()
    const currentQualityInput = document.querySelector<HTMLElement>('div[data-a-target="player-settings-menu"] input[checked=""]')!
    currentQualityInput.focus()
  }
})

let streamGameAnchor: HTMLElement | null
category.shortcuts.set('goToStreamCategory', {
  defaultKey: 'C',
  description: 'Go to stream category',
  isAvailable: () => {
    if (document.activeElement?.getAttribute('data-test-selector') === 'TitleAndChannel') {
      streamGameAnchor = document.activeElement.nextElementSibling?.querySelector('[data-test-selector="GameLink"]') as HTMLElement | null
      return streamGameAnchor?.offsetParent
    }
    if (window.location.pathname === '/') return false
    streamGameAnchor = document.querySelector<HTMLElement>('a[data-a-target="stream-game-link"]')
    return streamGameAnchor?.offsetParent
  },
  event: () => {
    streamGameAnchor!.click()
  }
})

let streamInformationSection: HTMLElement | null
category.shortcuts.set('scrollToStreamDescription', {
  defaultKey: 'd',
  description: 'Scroll to description/video',
  isAvailable: () => {
    streamInformationSection = document.querySelector('.channel-info-content section#live-channel-stream-information')
    return streamInformationSection?.offsetParent
  },
  event: () => {
    if (document.activeElement !== streamInformationSection) {
      streamInformationSection!.focus()
      // TODO first time scrolling will work incorrectly
      streamInformationSection!.scrollIntoView()
    } else {
      streamInformationSection!.blur()
      const video = document.querySelector('video')!
      video.scrollIntoView()
    }
  }
})
