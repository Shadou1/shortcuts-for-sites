import { ShortcutsCategory } from '../Shortcuts'

const category = new ShortcutsCategory('Sidebar', 'Left sidebar')
export default category

category.shortcuts.set('expandLeftSidebar', {
  defaultKey: 'E',
  description: 'Expand/collapse left sidebar',
  event: () => {
    const collapseLeftNavButton = document.querySelector<HTMLButtonElement>('button[data-a-target="side-nav-arrow"]')
    collapseLeftNavButton?.click()
  }
})

category.shortcuts.set('focusFollowedChannels', {
  defaultKey: 'u',
  description: 'Focus followed channels',
  event: () => {
    const firstFollowedChannel = document.querySelector<HTMLAnchorElement>('#side-nav .tw-transition-group a[data-test-selector="followed-channel"]')
    firstFollowedChannel?.focus()
  }
})

category.shortcuts.set('focusRecommendedChannels', {
  defaultKey: 'r',
  description: 'Focus recommended channels',
  event: () => {
    const firstRecommendedChannel = document.querySelector<HTMLAnchorElement>('#side-nav .tw-transition-group a[data-test-selector="recommended-channel"]')
    firstRecommendedChannel?.focus()
  }
})
