import { ShortcutsCategory } from '../Shortcuts'

const category = new ShortcutsCategory('Mini player', 'Mini player')
export default category

let expandMiniPlayerButton: HTMLButtonElement | null
category.shortcuts.set('expandMiniPlayer', {
  defaultKey: 'x',
  description: 'Expand mini player',
  isAvailable: () => {
    expandMiniPlayerButton = document.querySelector('[data-a-player-state="mini"] .player-overlay-background > div:nth-child(2) button')
    return expandMiniPlayerButton?.offsetParent
  },
  event: () => {
    expandMiniPlayerButton!.click()
  }
})

let closeMiniPlayerButton: HTMLButtonElement | null
category.shortcuts.set('closeMiniPlayer', {
  defaultKey: 'X',
  description: 'Close mini player',
  isAvailable: () => {
    closeMiniPlayerButton = document.querySelector('[data-a-player-state="mini"] .player-overlay-background > div:first-child button')
    return closeMiniPlayerButton?.offsetParent
  },
  event: () => {
    closeMiniPlayerButton!.click()
  }
})
