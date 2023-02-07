import { getSetupUpdateIndexOnFocus } from '../../utils/focusUtils'
import { getChangeIndex } from '../../utils/indexUtils'
import { findCommonParent, getSetupMutations } from '../../utils/mutationUtils'
import { ShortcutsCategory } from '../Shortcuts'

const category = new ShortcutsCategory('Search', 'Navigate search results')
export default category

// Get results and setup updating indexes on tabbing
let searchResultsAnchors: HTMLAnchorElement[] = []
let searchResultIndex = -1
let changeSearchResultIndex: ReturnType<typeof getChangeIndex>

let searchSuggestedAnchors: HTMLAnchorElement[] = []
let searchSuggestedIndex = -1
// let changeSearchSuggestedIndex: ReturnType<typeof getChangeIndex>

const setupUpdateSearchResultIndexOnFocus = getSetupUpdateIndexOnFocus((index) => searchResultIndex = index)
const setupUpdateSearchSuggestedIndexOnFocus = getSetupUpdateIndexOnFocus((index) => searchSuggestedIndex = index)

function getSearchResults() {
  const urlSearchParams = new URLSearchParams(window.location.search)
  const queryType = urlSearchParams.get('tbm')

  let searchResultsDivs: NodeListOf<HTMLElement>
  let searchResultsDivsAdditional: NodeListOf<HTMLElement> | null = null

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

    // Populate search results
    searchResultsAnchors = []

    if (searchResultsDivsAdditional) {
      for (const additionalSearchResult of searchResultsDivsAdditional) {
        const resultAnchor = additionalSearchResult.querySelector('a')
        if (resultAnchor?.offsetParent) searchResultsAnchors.push(resultAnchor)

      }
    }

    let workingDivs: NodeListOf<HTMLElement>
    if (searchResultsDivs.length === 1) {
      // Special all search page (like movie page)
      workingDivs = searchResultsDivs[0].querySelectorAll(':is([aria-hidden="false"], :not([aria-hidden="hidden"])) [role="tabpanel"] #kp-wp-tab-overview > div')
    } else {
      workingDivs = searchResultsDivs
    }

    for (const workingDiv of workingDivs) {
      const resultAnchor = workingDiv.querySelector('a')
      if (resultAnchor?.offsetParent) searchResultsAnchors.push(resultAnchor)
    }

    // Populate search suggested
    searchSuggestedAnchors = []
    const searchSuggestedAnchorsAll = document.querySelectorAll<HTMLAnchorElement>('a[data-xbu="true"]')
    searchSuggestedAnchorsAll.forEach((suggestedAnchor) => {
      if (suggestedAnchor.offsetParent) {
        searchSuggestedAnchors.push(suggestedAnchor)
      }
    })

  } else if (queryType === 'isch') {
    // Populate image results
    searchResultsAnchors = [...document.querySelectorAll<HTMLAnchorElement>('#islmp[role="main"] a[tabindex="0"]')]

    // Populate suggested image searches
    searchSuggestedAnchors = [...document.querySelectorAll<HTMLAnchorElement>('scrolling-carousel a[href*="tbm=isch"]')]
  }

  // Setup change indexes
  changeSearchResultIndex = getChangeIndex(searchResultsAnchors)
  // changeSearchSuggestedIndex = getChangeIndex(searchSuggestedAnchors)

  // Setup updating indexes on tabbing
  setupUpdateSearchResultIndexOnFocus(searchResultsAnchors)
  setupUpdateSearchSuggestedIndexOnFocus(searchSuggestedAnchors)

  return searchResultsAnchors
}

// Setup mutations on images page
const [setupImageMutations] = getSetupMutations(getSearchResults, {
  mutationWaitTimeMs: 100
})

let isMutationsSetup = false
function updateSearchResults() {
  if (isMutationsSetup) return searchResultsAnchors.length

  const searchResultsAnchorsLength = getSearchResults().length
  if (searchResultsAnchorsLength < 2) return searchResultsAnchorsLength

  // Bellow code will only run once
  isMutationsSetup = true

  const urlSearchParams = new URLSearchParams(window.location.search)
  const queryType = urlSearchParams.get('tbm')
  if (queryType === 'isch') {
    // Need to look for mutations on infinitely scrollable image search pages
    const imagesCommonParent = findCommonParent(searchResultsAnchors[0], searchResultsAnchors[1])
    setupImageMutations(imagesCommonParent)
  }

  return searchResultsAnchorsLength
}


category.initialize = () => {
  // On document_idle
  updateSearchResults()
}

const searchResultScrollLength = 250
function focusSearchResult(which: Parameters<typeof changeSearchResultIndex>[0]) {
  // const prevIndex = searchResultIndex
  searchResultIndex = changeSearchResultIndex(which, searchResultIndex)
  // if (searchResultIndex === prevIndex) return

  const currentSearchAnchor = searchResultsAnchors[searchResultIndex]
  const currentSearchAnchorRect = currentSearchAnchor.getBoundingClientRect()
  const scrollLength = Math.min(searchResultScrollLength, window.innerHeight / 2.5)
  window.scrollBy(0, currentSearchAnchorRect.top - scrollLength)
  currentSearchAnchor.focus()
}

category.shortcuts.set('nextSearchResult', {
  defaultKey: 'j',
  description: 'Focus next search result / image',
  isAvailable: updateSearchResults,
  event: () => {
    focusSearchResult('next')
  }
})

category.shortcuts.set('previousSearchResult', {
  defaultKey: 'k',
  description: 'Focus previous search result / image',
  isAvailable: updateSearchResults,
  event: () => {
    focusSearchResult('previous')
  }
})

category.shortcuts.set('firstSearchResult', {
  defaultKey: 'K',
  description: 'Focus first search result / image',
  isAvailable: updateSearchResults,
  event: () => {
    focusSearchResult('first')
  }
})

category.shortcuts.set('lastSearchResult', {
  defaultKey: 'J',
  description: 'Focus last search result / image',
  isAvailable: updateSearchResults,
  event: () => {
    focusSearchResult('last')
  }
})

const nextPageAnchor = document.querySelector<HTMLAnchorElement>('a#pnnext')
const previousPageAnchor = document.querySelector<HTMLAnchorElement>('a#pnprev')

category.shortcuts.set('nextSearchPage', {
  defaultKey: ']',
  description: 'Go to next search page',
  isAvailable: () => nextPageAnchor,
  event: () => {
    nextPageAnchor?.click()
  }
})

category.shortcuts.set('previousSearchPage', {
  defaultKey: '[',
  description: 'Go to previous search page',
  isAvailable: () => previousPageAnchor,
  event: () => {
    previousPageAnchor?.click()
  }
})

category.shortcuts.set('nextSuggestedSearch', {
  defaultKey: 'o',
  description: 'Focus next suggested search',
  isAvailable: updateSearchResults,
  event: () => {
    searchSuggestedIndex = (searchSuggestedIndex + 1) % searchSuggestedAnchors.length
    const currentSuggestedAnchor = searchSuggestedAnchors[searchSuggestedIndex]
    const currentSuggestedAnchorRect = currentSuggestedAnchor.getBoundingClientRect()
    const scrollLength = Math.min(searchResultScrollLength, window.innerHeight / 2.5)
    window.scrollBy(0, currentSuggestedAnchorRect.top - scrollLength)
    currentSuggestedAnchor.focus()
  }
})
