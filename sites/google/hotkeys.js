let lastSearchString = ''
let lastSearchQuery = ''

let searchResultIndex = -1
let searchResultsDivs = []
let searchResultsAnchors = []

let searchRelatedIndex = -1
let searchRelatedAnchors = []

const nextPageAnchor = document.querySelector('a#pnnext')
const previousPageAnchor = document.querySelector('a#pnprev')

function updateResults() {
  const currentSearchString = window.location.search
  if (currentSearchString !== lastSearchString) {
    lastSearchString = currentSearchString
    const currentSearchQuery = new URLSearchParams(currentSearchString).get('q')
    if (currentSearchQuery !== lastSearchQuery) {
      lastSearchQuery = currentSearchQuery

      // Populate search results
      searchResultsDivs = document.querySelectorAll('#rso > div')
      searchRelatedAnchors = []
      for (let i = 0; i < searchResultsDivs.length; i++) {
        const resultAnchor = searchResultsDivs[i].querySelector('a')
        if (resultAnchor?.offsetParent) searchResultsAnchors.push(resultAnchor)
      }
      searchResultIndex = -1

      // Populate search related
      searchRelatedAnchors = []
      const searchRelatedAnchorsAll = document.querySelectorAll('#bres a')
      searchRelatedAnchorsAll.forEach((relatedAnchor) => relatedAnchor.offsetParent && searchRelatedAnchors.push(relatedAnchor))

      searchRelatedIndex = -1

    }
  }
}

const hotkeys = {

  'l': {
    category: 'Search',
    description: 'Focus next search result',
    event: () => {
      if (window.location.pathname !== '/search') return

      updateResults()

      searchResultIndex = (searchResultIndex + 1) % searchResultsAnchors.length
      const currentSearchAnchor = searchResultsAnchors[searchResultIndex]
      currentSearchAnchor.focus()
      currentSearchAnchor.scrollIntoView()
      window.scrollBy(0, -Math.min(350, window.innerHeight / 2))
    }
  },

  'j': {
    category: 'Search',
    description: 'Focus previous search result',
    event: () => {
      if (window.location.pathname !== '/search') return

      updateResults()

      searchResultIndex = searchResultIndex > 0 ? searchResultIndex - 1 : searchResultsAnchors.length - 1
      const currentSearchAnchor = searchResultsAnchors[searchResultIndex]
      currentSearchAnchor.focus()
      currentSearchAnchor.scrollIntoView()
      window.scrollBy(0, -Math.min(350, window.innerHeight / 2))
    }
  },

  'L': {
    category: 'Search',
    description: 'Go to next search page',
    verbatum: 'Shift+l',
    event: () => {
      if (window.location.pathname !== '/search') return
      
      nextPageAnchor.click()
    }
  },

  'J': {
    category: 'Search',
    description: 'Go to previous search page',
    verbatum: 'Shift+j',
    event: () => {
      if (window.location.pathname !== '/search') return

      previousPageAnchor?.click()
    }
  },

  'o': {
    category: 'Search',
    description: 'Focus next related search',
    event: () => {
      if (window.location.pathname !== '/search') return

      updateResults()

      searchRelatedIndex = (searchRelatedIndex + 1) % searchRelatedAnchors.length
      const currentRelatedAnchor = searchRelatedAnchors[searchRelatedIndex]
      currentRelatedAnchor.focus()
      currentRelatedAnchor.scrollIntoView()
    }
  },

}

Object.assign(keyboardOnlyNavigation.hotkeys, hotkeys)