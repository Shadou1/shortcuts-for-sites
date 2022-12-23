let lastSearchString = ''
let lastSearchQuery = ''

let searchResultsDivs = []
let searchResultsDivsAdditional = []
let searchResultsAnchors = []
let searchResultIndex = -1

let searchSuggestedAnchors = []
let searchSuggestedIndex = -1

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
  whenTargetMutates('#islmp[role="main"]', (_mutations, _observer) => {
    didPageMutate = true
  })
})

let abortUpdateIndexSearch = []
let abortUpdateIndexSuggested = []

function updateIndexSearch(toIndex) {
  return function () {
    searchResultIndex = toIndex
  }
}

function updateIndexSuggested(toIndex) {
  return function () {
    searchSuggestedIndex = toIndex
  }
}

function updateResults() {
  // don't update if on the same page and the page hasn't mutated (for image searches)
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
    searchSuggestedIndex = -1
  }

  if (didPageMutate) {
    abortUpdateIndexSearch.forEach((abortController) => abortController.abort())
    abortUpdateIndexSuggested.forEach((abortController) => abortController.abort())
    abortUpdateIndexSearch = []
    abortUpdateIndexSuggested = []
  }

  didPageMutate = false

  // Populate search results
  // all search, news, videos
  if (queryType === null || queryType === 'nws' || queryType === 'vid') {

    switch (queryType) {
      case null:
        searchResultsDivsAdditional = document.querySelectorAll('#rcnt > div:first-of-type:not(#center_col)')
        searchResultsDivs = document.querySelectorAll('#rcnt > #center_col #rso > div')
        break
      case 'nws':
        searchResultsDivs = document.querySelectorAll('#rcnt > #center_col #rso > div > div[data-hveid] > div')
        break
      case 'vid':
        searchResultsDivs = document.querySelectorAll('#rcnt > #center_col #rso > div')
        break
    }

    for (let i = 0; i < searchResultsDivsAdditional.length; i++) {
      const resultAnchor = searchResultsDivsAdditional[i].querySelector('a')
      if (resultAnchor?.offsetParent) searchResultsAnchors.push(resultAnchor)
    }

    // Populate search results
    let workingDivs
    if (searchResultsDivs.length === 1) {
      // Special all search page (like movie page)
      workingDivs = searchResultsDivs[0].querySelectorAll(':is([aria-hidden="false"], :not([aria-hidden="hidden"])) [role="tabpanel"] #kp-wp-tab-overview > div')
    } else {
      workingDivs = searchResultsDivs
    }

    for (let i = 0; i < workingDivs.length; i++) {
      const resultAnchor = workingDivs[i].querySelector('a')
      if (resultAnchor?.offsetParent) searchResultsAnchors.push(resultAnchor)
    }

    // Populate search suggested
    searchSuggestedAnchors = []
    const searchSuggestedAnchorsAll = document.querySelectorAll('a[data-xbu="true"]')
    searchSuggestedAnchorsAll.forEach((suggestedAnchor) => {
      if (suggestedAnchor.offsetParent) {
        searchSuggestedAnchors.push(suggestedAnchor)
      }
    })

  } else if (queryType === 'isch') {
    // Populate image results
    searchResultsAnchors = document.querySelectorAll('#islmp[role="main"] a[tabindex="0"]')

    // Populate suggested image searches
    searchSuggestedAnchors = document.querySelectorAll('scrolling-carousel a[href*="tbm=isch"]')
  }

  searchResultsAnchors.forEach((searchResult, index) => {
    const abortController = new AbortController()
    searchResult.addEventListener('focus', updateIndexSearch(index), { signal: abortController.signal })
    abortUpdateIndexSearch.push(abortController)
  })

  searchSuggestedAnchors.forEach((suggestedResult, index) => {
    const abortController = new AbortController()
    suggestedResult.addEventListener('focus', updateIndexSuggested(index), { signal: abortController.signal })
    abortUpdateIndexSuggested.push(abortController)
  })

}

// On page loaded
updateResults()

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

shortcuts.set('nextSuggestedSearch', {
  category: 'Search',
  defaultKey: 'o',
  description: 'Focus next suggested search',
  event: () => {
    updateResults()

    searchSuggestedIndex = (searchSuggestedIndex + 1) % searchSuggestedAnchors.length
    const currentSuggestedAnchor = searchSuggestedAnchors[searchSuggestedIndex]
    currentSuggestedAnchor.focus()
    currentSuggestedAnchor.scrollIntoView()
    const scrollLength = Math.min(350, window.innerHeight / 2)
    window.scrollBy(0, window.scrollY < document.body.scrollHeight - window.innerHeight ? -scrollLength : -100)
  }
})
