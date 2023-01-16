import { ShortcutsCategory } from '../Shortcuts'

const category = new ShortcutsCategory('Navigation', 'Navigation')
export default category

let homeAnchor: HTMLAnchorElement | null
category.shortcuts.set('goToHome', {
  defaultKey: 'o',
  description: 'Go to home',
  event: () => {
    homeAnchor = homeAnchor ?? document.querySelector('header a[href="/"]')
    homeAnchor?.click()
  }
})

let popularAnchor: HTMLAnchorElement | null
category.shortcuts.set('goToPopular', {
  defaultKey: 'u',
  description: 'Go to popular',
  event: () => {
    popularAnchor = popularAnchor ?? document.querySelector('header a[href*="popular"]')
    popularAnchor?.click()
  }
})
