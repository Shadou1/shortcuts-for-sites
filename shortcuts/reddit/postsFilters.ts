import { ShortcutsCategory } from '../Shortcuts'
import { didPathnameChange } from '../../utils/locationUtils'

const didPagePathnameChange = didPathnameChange()

const category = new ShortcutsCategory('Posts filters', 'Posts filters')
export default category

let hotPostsAnchor: HTMLAnchorElement | null
category.shortcuts.set('showHotPosts', {
  defaultKey: '1',
  description: 'Hot posts',
  isAvailable: () => {
    hotPostsAnchor = hotPostsAnchor?.offsetParent ? hotPostsAnchor : document.querySelector('a[href*="hot"][role="button"]')
    return hotPostsAnchor?.offsetParent
  },
  event: () => {
    hotPostsAnchor!.click()
  }
})

let newPostsAnchor: HTMLAnchorElement | null
category.shortcuts.set('showNewPosts', {
  defaultKey: '2',
  description: 'New posts',
  isAvailable: () => {
    newPostsAnchor = newPostsAnchor?.offsetParent ? newPostsAnchor : document.querySelector('a[href*="new"][role="button"]')
    return newPostsAnchor?.offsetParent
  },
  event: () => {
    newPostsAnchor!.click()
  }
})

let topPostsAnchor: HTMLAnchorElement | null
category.shortcuts.set('showTopPosts', {
  defaultKey: '3',
  description: 'Top posts',
  isAvailable: () => {
    topPostsAnchor = topPostsAnchor?.offsetParent ? topPostsAnchor : document.querySelector('a[href*="top"][role="button"]')
    return topPostsAnchor?.offsetParent
  },
  event: () => {
    topPostsAnchor!.click()
  }
})

let risingPostsAnchor: HTMLAnchorElement | null
function updateRisingAnchor() {
  // Anchor is hidden, and current one might refer to the previous /rising page (from a subreddit, from a /poular, or from a home page)
  if (didPagePathnameChange()) {
    risingPostsAnchor = document.querySelector('a[href*="rising"][role="menuitem"]')
  }
  risingPostsAnchor = risingPostsAnchor ?? document.querySelector('a[href*="rising"][role="menuitem"]')
  return risingPostsAnchor
}

category.shortcuts.set('showRisingPosts', {
  defaultKey: '4',
  description: 'Rising posts',
  isAvailable: () => updateRisingAnchor(),
  event: () => {
    risingPostsAnchor!.click()
  }
})

let timeSortAnchor: HTMLAnchorElement | null
category.shortcuts.set('chooseTimePeriod', {
  defaultKey: 't',
  description: 'Choose time period',
  isAvailable: () => {
    timeSortAnchor = timeSortAnchor?.offsetParent ? timeSortAnchor : document.querySelector('button#TimeSort--SortPicker')
    return timeSortAnchor?.offsetParent
  },
  event: () => {
    timeSortAnchor!.click()
  }
})
