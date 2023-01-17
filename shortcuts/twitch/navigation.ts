import { pathnameEndsWith } from '../../utils/locationUtils'
import { whenElementMutatesQuery } from '../../utils/mutationUtils'
import { navigateToLiveChannels } from './utils'
import { ShortcutsCategory } from '../Shortcuts'

const category = new ShortcutsCategory('Navigation', 'Navigation')
export default category

let homeAnchor: HTMLElement | null
category.shortcuts.set('goToHome', {
  defaultKey: 'o',
  description: 'Go to home',
  event: () => {
    if (window.location.pathname === '/') return
    homeAnchor = homeAnchor ?? document.querySelector('a[data-a-target="home-link"]')
    homeAnchor?.click()
  }
})

let followingAnchor: HTMLElement | null
category.shortcuts.set('goToFollowing', {
  defaultKey: 'U',
  description: 'Go to following',
  event: () => {
    if (pathnameEndsWith('/following')) return
    followingAnchor = followingAnchor ?? document.querySelector('a[data-a-target="following-link"]')
    followingAnchor?.click()
  }
})

let browseAnchor: HTMLElement | null
category.shortcuts.set('goToCategories', {
  defaultKey: 'b',
  description: 'Browse categories',
  event: () => {
    if (pathnameEndsWith('/directory/all')) {
      const categoriesAnchor = document.querySelector<HTMLElement>('a[data-a-target="browse-type-tab-categories"]')
      categoriesAnchor?.click()
    } else if (!pathnameEndsWith('/directory')) {
      browseAnchor = browseAnchor ?? document.querySelector('a[data-a-target="browse-link"]')
      browseAnchor?.click()
    }
  }
})

category.shortcuts.set('goToLiveChannels', {
  defaultKey: 'B',
  description: 'Browse live channels',
  event: () => {
    if (pathnameEndsWith('/directory/all')) return
    if (pathnameEndsWith('/directory')) {
      navigateToLiveChannels()
    } else {
      browseAnchor = browseAnchor ?? document.querySelector('a[data-a-target="browse-link"]')
      browseAnchor?.click()
      whenElementMutatesQuery('main', navigateToLiveChannels)
    }
  }
})

let twSelectButton: HTMLButtonElement | null
category.shortcuts.set('selectFilterBy', {
  defaultKey: 'i',
  description: 'Filter/sort by',
  isAvailable: () => {
    twSelectButton = twSelectButton?.offsetParent ? twSelectButton : document.querySelector<HTMLButtonElement>('.tw-select-button')
    return twSelectButton?.offsetParent
  },
  event: () => {
    twSelectButton!.click()
    twSelectButton!.focus()
  }
})
