import { ShortcutsCategory } from '../Shortcuts'

const category = new ShortcutsCategory('Search modes', 'Select search mode')
export default category

let allResultsAnchor: HTMLElement | null
category.shortcuts.set('goToAll', {
  defaultKey: 'a',
  description: 'Go to all search results',
  event: () => {
    allResultsAnchor = allResultsAnchor?.offsetParent ? allResultsAnchor : document.querySelector('a[href*="source=lmns"]:not([href*="tbm"]), a[href*="source=lnms"]:not([href*="tbm"])')
    if (!allResultsAnchor?.offsetParent) return
    allResultsAnchor.click()
  }
})

let imagesAnchor: HTMLElement | null
category.shortcuts.set('goToImages', {
  defaultKey: 'i',
  description: 'Go to images',
  event: () => {
    imagesAnchor = imagesAnchor?.offsetParent ? imagesAnchor : document.querySelector(':is(#top_nav, div[data-tn="0"]) a[href*="tbm=isch"]')
    if (!imagesAnchor?.offsetParent) return
    imagesAnchor.click()
  }
})

let videosAnchor: HTMLElement | null
category.shortcuts.set('goToVideos', {
  defaultKey: 'v',
  description: 'Go to videos',
  event: () => {
    videosAnchor = videosAnchor?.offsetParent ? videosAnchor : document.querySelector(':is(#top_nav, div[data-tn="0"]) a[href*="tbm=vid"]')
    if (!videosAnchor?.offsetParent) return
    videosAnchor.click()
  }
})

let newsAnchor: HTMLElement | null
category.shortcuts.set('goToNews', {
  defaultKey: 'n',
  description: 'Go to news',
  event: () => {
    newsAnchor = newsAnchor?.offsetParent ? newsAnchor : document.querySelector(':is(#top_nav, div[data-tn="0"]) a[href*="tbm=nws"]')
    if (!newsAnchor?.offsetParent) return
    newsAnchor.click()
  }
})
