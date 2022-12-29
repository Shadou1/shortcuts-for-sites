let whenElementMutates
import(browser.runtime.getURL('utils/mutationUtils.js')).then((result) => {
  ({ whenElementMutates } = result)
  // On document_idle
  updateSearchResults()
})

export const shortcuts = new Map()

let allResultsAnchor = document.querySelector('a[href*="source=lmns"]:not([href*="tbm"]), a[href*="source=lnms"]:not([href*="tbm"])')
let imageAnchor = document.querySelector(':is(#top_nav, div[data-tn="0"]) a[href*="tbm=isch"]')
let videoAnchor = document.querySelector(':is(#top_nav, div[data-tn="0"]) a[href*="tbm=vid"]')
let newsAnchor = document.querySelector(':is(#top_nav, div[data-tn="0"]) a[href*="tbm=nws"]')

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

let searchResultsDivs = []
let searchResultsDivsAdditional = []
let searchResultsAnchors = []
let searchResultIndex = -1

let searchSuggestedAnchors = []
let searchSuggestedIndex = -1

let updateSearchResultIndexAborts = []
let updateSearchSuggestedIndexAborts = []

function updateSearchResultIndex(toIndex) {
  return function () {
    searchResultIndex = toIndex
  }
}

function updateSearchSuggestedIndex(toIndex) {
  return function () {
    searchSuggestedIndex = toIndex
  }
}

let lastMutationTimeout
const mutationWaitTimeMs = 100
// Static MutationObserver, because google pages are not dynamic (redirect causes page reload)
function setupImageMutations() {
  const firstElementParents = []
  let currentFirstElementParent = searchResultsAnchors[0].parentElement
  while (currentFirstElementParent) {
    firstElementParents.unshift(currentFirstElementParent)
    currentFirstElementParent = currentFirstElementParent.parentElement
  }
  // Look for the second element and not the last one like on Youtube
  // Because last element when new image results are added is incorrect before scrolling to it
  const lastElementParents = []
  let currentLastElementParent = searchResultsAnchors[1].parentElement
  while (currentLastElementParent) {
    lastElementParents.unshift(currentLastElementParent)
    currentLastElementParent = currentLastElementParent.parentElement
  }

  let commonParent = lastElementParents[0]
  for (let i = 1; i < lastElementParents.length; i++) {
    if (firstElementParents[i] !== lastElementParents[i]) break
    commonParent = lastElementParents[i]
  }

  whenElementMutates(commonParent, (_mutations, _observer) => {
    clearTimeout(lastMutationTimeout)
    lastMutationTimeout = setTimeout(() => {
      getSearchResults()
    }, mutationWaitTimeMs)
  }, { childList: true })
}

function getSearchResults() {
  updateSearchResultIndexAborts.forEach((abortController) => abortController.abort())
  updateSearchSuggestedIndexAborts.forEach((abortController) => abortController.abort())
  updateSearchResultIndexAborts = []
  updateSearchSuggestedIndexAborts = []

  const urlSearchParams = new URLSearchParams(window.location.search)
  const queryType = urlSearchParams.get('tbm')

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
    searchResult.addEventListener('focus', updateSearchResultIndex(index), { signal: abortController.signal })
    updateSearchResultIndexAborts.push(abortController)
  })

  searchSuggestedAnchors.forEach((suggestedResult, index) => {
    const abortController = new AbortController()
    suggestedResult.addEventListener('focus', updateSearchSuggestedIndex(index), { signal: abortController.signal })
    updateSearchSuggestedIndexAborts.push(abortController)
  })

  return searchResultsAnchors
}

let isMutationsSetup = false
function updateSearchResults() {
  if (isMutationsSetup) return searchResultsAnchors.length

  const searchResultsAnchorsLength = getSearchResults().length

  if (!searchResultsAnchorsLength) return searchResultsAnchorsLength
  // Bellow code will only run once
  isMutationsSetup = true

  const urlSearchParams = new URLSearchParams(window.location.search)
  const queryType = urlSearchParams.get('tbm')
  if (queryType === 'isch') {
    // Need to look for mutations on infinitely scrollable image search pages
    setupImageMutations()
  }

  return searchResultsAnchorsLength
}

const searchResultScrollLength = 250

shortcuts.set('nextSearchResult', {
  category: 'Search',
  defaultKey: 'j',
  description: 'Focus next search result / image',
  isAvailable: () => updateSearchResults(),
  event: () => {
    let lastIndex = searchResultIndex
    searchResultIndex = Math.min(searchResultIndex + 1, searchResultsAnchors.length - 1)
    if (searchResultIndex === lastIndex) return

    const currentSearchAnchor = searchResultsAnchors[searchResultIndex]
    const currentSearchAnchorRect = currentSearchAnchor.getBoundingClientRect()
    const scrollLength = Math.min(searchResultScrollLength, window.innerHeight / 2.5)
    window.scrollBy(0, currentSearchAnchorRect.top - scrollLength)
    currentSearchAnchor.focus()
  }
})

shortcuts.set('previousSearchResult', {
  category: 'Search',
  defaultKey: 'k',
  description: 'Focus previous search result / image',
  isAvailable: () => updateSearchResults(),
  event: () => {
    let lastIndex = searchResultIndex
    searchResultIndex = Math.max(searchResultIndex - 1, 0)
    if (searchResultIndex === lastIndex) return

    const currentSearchAnchor = searchResultsAnchors[searchResultIndex]
    const currentSearchAnchorRect = currentSearchAnchor.getBoundingClientRect()
    const scrollLength = Math.min(searchResultScrollLength, window.innerHeight / 2.5)
    window.scrollBy(0, currentSearchAnchorRect.top - scrollLength)
    currentSearchAnchor.focus()
  }
})

shortcuts.set('firstSearchResult', {
  category: 'Search',
  defaultKey: 'K',
  description: 'Focus first search result / image',
  isAvailable: () => updateSearchResults(),
  event: () => {
    if (searchResultIndex === 0) return
    searchResultIndex = 0

    const currentSearchAnchor = searchResultsAnchors[searchResultIndex]
    const currentSearchAnchorRect = currentSearchAnchor.getBoundingClientRect()
    const scrollLength = Math.min(searchResultScrollLength, window.innerHeight / 2.5)
    window.scrollBy(0, currentSearchAnchorRect.top - scrollLength)
    currentSearchAnchor.focus()
  }
})

shortcuts.set('lastSearchResult', {
  category: 'Search',
  defaultKey: 'J',
  description: 'Focus last search result / image',
  isAvailable: () => updateSearchResults(),
  event: () => {
    if (searchResultIndex === searchResultsAnchors.length - 1) return
    searchResultIndex = searchResultsAnchors.length - 1

    const currentSearchAnchor = searchResultsAnchors[searchResultIndex]
    const currentSearchAnchorRect = currentSearchAnchor.getBoundingClientRect()
    const scrollLength = Math.min(searchResultScrollLength, window.innerHeight / 2.5)
    window.scrollBy(0, currentSearchAnchorRect.top - scrollLength)
    currentSearchAnchor.focus()
  }
})

const nextPageAnchor = document.querySelector('a#pnnext')
const previousPageAnchor = document.querySelector('a#pnprev')

shortcuts.set('nextSearchPage', {
  category: 'Search',
  defaultKey: ']',
  description: 'Go to next search page',
  isAvailable: () => nextPageAnchor,
  event: () => {
    nextPageAnchor?.click()
  }
})

shortcuts.set('previousSearchPage', {
  category: 'Search',
  defaultKey: '[',
  description: 'Go to previous search page',
  isAvailable: () => previousPageAnchor,
  event: () => {
    previousPageAnchor?.click()
  }
})

shortcuts.set('nextSuggestedSearch', {
  category: 'Search',
  defaultKey: 'o',
  description: 'Focus next suggested search',
  isAvailable: () => updateSearchResults(),
  event: () => {
    searchSuggestedIndex = (searchSuggestedIndex + 1) % searchSuggestedAnchors.length
    const currentSuggestedAnchor = searchSuggestedAnchors[searchSuggestedIndex]
    const currentSuggestedAnchorRect = currentSuggestedAnchor.getBoundingClientRect()
    const scrollLength = Math.min(searchResultScrollLength, window.innerHeight / 2.5)
    window.scrollBy(0, currentSuggestedAnchorRect.top - scrollLength)
    currentSuggestedAnchor.focus()
  }
})
