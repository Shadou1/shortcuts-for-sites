let lastSearchString = ''
let lastSearchQuery = ''

let searchResultsDivs = []
let searchResultsAnchors = []
let searchResultIndex = -1

let searchRelatedAnchors = []
let searchRelatedIndex = -1

const nextPageAnchor = document.querySelector('a#pnnext')
const previousPageAnchor = document.querySelector('a#pnprev')

let allResultsAnchor = document.querySelector('a[href*="source=lmns"]:not([href*="tbm"]), a[href*="source=lnms"]:not([href*="tbm"])')
let imageAnchor = document.querySelector(':is(#top_nav, div[data-tn="0"]) a[href*="tbm=isch"]')
let videoAnchor = document.querySelector(':is(#top_nav, div[data-tn="0"]) a[href*="tbm=vid"]')
let newsAnchor = document.querySelector(':is(#top_nav, div[data-tn="0"]) a[href*="tbm=nws"]')

function updateResults() {
  const currentSearchString = window.location.search
  if (currentSearchString !== lastSearchString) {
    lastSearchString = currentSearchString
    const currentSearchQuery = new URLSearchParams(currentSearchString).get('q')
    if (currentSearchQuery !== lastSearchQuery) {
      lastSearchQuery = currentSearchQuery

      // Populate search results
      searchResultsDivs = document.querySelectorAll('#rcnt > div:first-of-type:not(#center_col), #rcnt > #center_col #rso > div')
      searchRelatedAnchors = []

      if (searchResultsDivs.length === 1) {
        // news
        searchResultsAnchors = document.querySelectorAll('#rso > div a')
      } else {
        // all results or videos
        for (let i = 0; i < searchResultsDivs.length; i++) {
          const resultAnchor = searchResultsDivs[i].querySelector('a')
          if (resultAnchor?.offsetParent) searchResultsAnchors.push(resultAnchor)
        }
      }
      searchResultIndex = -1

      // Populate search related
      searchRelatedAnchors = []
      const searchRelatedAnchorsAll = document.querySelectorAll('#bres a')
      searchRelatedAnchorsAll.forEach((relatedAnchor) => {
        if (relatedAnchor.offsetParent && relatedAnchor.getAttribute('data-xbu')) {
          searchRelatedAnchors.push(relatedAnchor)
        }
      })

      searchRelatedIndex = -1

    }
  }
}

const hotkeys = {

  'a': {
    category: 'Navigation',
    description: 'Go to all search results',
    event: () => {
      allResultsAnchor?.click()
    }
  },

  'i': {
    category: 'Navigation',
    description: 'Go to images',
    event: () => {
      if (!imageAnchor) imageAnchor = document.querySelector(':is(#top_nav, div[data-tn="0"]) a[href*="tbm=isch"]')
      if (!imageAnchor.offsetParent) return
      imageAnchor?.click()
    }
  },

  'v': {
    category: 'Navigation',
    description: 'Go to videos',
    event: () => {
      if (!videoAnchor) videoAnchor = document.querySelector(':is(#top_nav, div[data-tn="0"]) a[href*="tbm=vid"]')
      if (!videoAnchor.offsetParent) return
      videoAnchor?.click()
    }
  },

  'n': {
    category: 'Navigation',
    description: 'Go to news',
    event: () => {
      if (!newsAnchor) newsAnchor = document.querySelector(':is(#top_nav, div[data-tn="0"]) a[href*="tbm=nws"]')
      if (!newsAnchor.offsetParent) return
      newsAnchor?.click()
    }
  },

  'l': {
    category: 'Search',
    description: 'Focus next search result',
    event: () => {
      updateResults()

      searchResultIndex = (searchResultIndex + 1) % searchResultsAnchors.length
      const currentSearchAnchor = searchResultsAnchors[searchResultIndex]
      // console.log('before', window.scrollY, document.body.scrollHeight, window.innerHeight, document.body.scrollHeight - window.innerHeight)
      currentSearchAnchor.focus()
      currentSearchAnchor.scrollIntoView()
      const scrollLength = Math.min(350, window.innerHeight / 2)
      // console.log('after', window.scrollY, document.body.scrollHeight, window.innerHeight, document.body.scrollHeight - window.innerHeight)
      window.scrollBy(0, window.scrollY < document.body.scrollHeight - window.innerHeight ? -scrollLength : -100)
    }
  },

  'j': {
    category: 'Search',
    description: 'Focus previous search result',
    event: () => {
      updateResults()

      searchResultIndex = searchResultIndex > 0 ? searchResultIndex - 1 : searchResultsAnchors.length - 1
      const currentSearchAnchor = searchResultsAnchors[searchResultIndex]
      currentSearchAnchor.focus()
      currentSearchAnchor.scrollIntoView()
      const scrollLength = Math.min(350, window.innerHeight / 2)
      window.scrollBy(0, window.scrollY < document.body.scrollHeight - window.innerHeight ? -scrollLength : -100)
    }
  },

  'L': {
    category: 'Search',
    description: 'Go to next search page',
    verbatum: 'Shift+l',
    event: () => {
      nextPageAnchor.click()
    }
  },

  'J': {
    category: 'Search',
    description: 'Go to previous search page',
    verbatum: 'Shift+j',
    event: () => {
      previousPageAnchor?.click()
    }
  },

  'o': {
    category: 'Search',
    description: 'Focus next related search',
    event: () => {
      updateResults()

      searchRelatedIndex = (searchRelatedIndex + 1) % searchRelatedAnchors.length
      const currentRelatedAnchor = searchRelatedAnchors[searchRelatedIndex]
      currentRelatedAnchor.focus()
      currentRelatedAnchor.scrollIntoView()
    }
  },

}

Object.assign(keyboardOnlyNavigation.hotkeys, hotkeys)
