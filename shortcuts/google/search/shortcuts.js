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

let didPageMutate = false
let whenTargetMutates
import(browser.runtime.getURL('utils/mutationUtils.js')).then((result) => {
  ({ whenTargetMutates } = result)
  if (!window.location.pathname.match('tbm=isch')) return
  // Mutates only on images page
  whenTargetMutates('#islmp[role="main"]', (mutations, observer) => {
    didPageMutate = true
  })
})

let abortUpdateIndexSearch = []
let abortUpdateIndexRelated = []

function updateIndexSearch(toIndex) {
  return function () {
    searchResultIndex = toIndex
  }
}

function updateIndexRelated(toIndex) {
  return function () {
    searchRelatedIndex = toIndex
  }
}

function updateResults() {
  const currentSearchString = window.location.search
  if (currentSearchString === lastSearchString && !didPageMutate) return
  lastSearchString = currentSearchString

  const urlSearchParams = new URLSearchParams(currentSearchString)
  const currentSearchQuery = urlSearchParams.get('q')
  if (currentSearchQuery === lastSearchQuery && !didPageMutate) return
  lastSearchQuery = currentSearchQuery

  const queryType = urlSearchParams.get('tbm')

  if (!didPageMutate) {
    searchResultIndex = -1
    searchRelatedIndex = -1
  }

  if (didPageMutate) {
    abortUpdateIndexSearch.forEach((abortController) => abortController.abort())
    abortUpdateIndexRelated.forEach((abortController) => abortController.abort())
    abortUpdateIndexSearch = []
    abortUpdateIndexRelated = []
  }

  didPageMutate = false

  // Populate search results
  switch (queryType) {
    // news, videos, all search
    case 'nws':
    case 'vid':
    case null: {
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

      // Populate search related
      searchRelatedAnchors = []
      const searchRelatedAnchorsAll = document.querySelectorAll('#bres a')
      searchRelatedAnchorsAll.forEach((relatedAnchor) => {
        if (relatedAnchor.offsetParent && relatedAnchor.getAttribute('data-xbu')) {
          searchRelatedAnchors.push(relatedAnchor)
        }
      })
      break
    }

    // image search
    case 'isch': {
      // Populate image results
      searchResultsAnchors = document.querySelectorAll('#islmp[role="main"] a[tabindex="0"]')

      // Populate
      searchRelatedAnchors = document.querySelectorAll('scrolling-carousel a[href*="tbm=isch"]')
      break
    }

  }

  searchResultsAnchors.forEach((searchResult, index) => {
    const abortController = new AbortController()
    searchResult.addEventListener('focus', updateIndexSearch(index), { signal: abortController.signal })
    abortUpdateIndexSearch.push(abortController)
  })

  searchRelatedAnchors.forEach((relatedResult, index) => {
    const abortController = new AbortController()
    relatedResult.addEventListener('focus', updateIndexRelated(index), { signal: abortController.signal })
    abortUpdateIndexRelated.push(abortController)
  })

}

export const shortcuts = new Map()


shortcuts.set('goToAll', {
  category: 'Navigation',
  defaultKey: 'a',
  description: 'Go to all search results',
  event: () => {
    allResultsAnchor?.click()
  }
})

shortcuts.set('goToImages', {
  category: 'Navigation',
  defaultKey: 'i',
  description: 'Go to images',
  event: () => {
    if (!imageAnchor) imageAnchor = document.querySelector(':is(#top_nav, div[data-tn="0"]) a[href*="tbm=isch"]')
    if (!imageAnchor.offsetParent) return
    imageAnchor?.click()
  }
})

shortcuts.set('goToVideos', {
  category: 'Navigation',
  defaultKey: 'v',
  description: 'Go to videos',
  event: () => {
    if (!videoAnchor) videoAnchor = document.querySelector(':is(#top_nav, div[data-tn="0"]) a[href*="tbm=vid"]')
    if (!videoAnchor.offsetParent) return
    videoAnchor?.click()
  }
})

shortcuts.set('goToNews', {
  category: 'Navigation',
  defaultKey: 'n',
  description: 'Go to news',
  event: () => {
    if (!newsAnchor) newsAnchor = document.querySelector(':is(#top_nav, div[data-tn="0"]) a[href*="tbm=nws"]')
    if (!newsAnchor.offsetParent) return
    newsAnchor?.click()
  }
})

shortcuts.set('nextSearchResult', {
  category: 'Search',
  defaultKey: 'j',
  description: 'Focus next search result / image',
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
})

shortcuts.set('previousSearchResult', {
  category: 'Search',
  defaultKey: 'k',
  description: 'Focus previous search result / image',
  event: () => {
    updateResults()

    searchResultIndex = searchResultIndex > 0 ? searchResultIndex - 1 : searchResultsAnchors.length - 1
    const currentSearchAnchor = searchResultsAnchors[searchResultIndex]
    currentSearchAnchor.focus()
    currentSearchAnchor.scrollIntoView()
    const scrollLength = Math.min(350, window.innerHeight / 2)
    window.scrollBy(0, window.scrollY < document.body.scrollHeight - window.innerHeight ? -scrollLength : -100)
  }
})

shortcuts.set('nextSearchPage', {
  category: 'Search',
  defaultKey: 'J',
  description: 'Go to next search page',
  event: () => {
    nextPageAnchor.click()
  }
})

shortcuts.set('previousSearchPage', {
  category: 'Search',
  defaultKey: 'K',
  description: 'Go to previous search page',
  event: () => {
    previousPageAnchor?.click()
  }
})

shortcuts.set('nextRelatedSearch', {
  category: 'Search',
  defaultKey: 'o',
  description: 'Focus next related search',
  event: () => {
    updateResults()

    searchRelatedIndex = (searchRelatedIndex + 1) % searchRelatedAnchors.length
    const currentRelatedAnchor = searchRelatedAnchors[searchRelatedIndex]
    currentRelatedAnchor.focus()
    currentRelatedAnchor.scrollIntoView()
    const scrollLength = Math.min(350, window.innerHeight / 2)
    window.scrollBy(0, window.scrollY < document.body.scrollHeight - window.innerHeight ? -scrollLength : -100)
  }
})



