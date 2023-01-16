import { whenElementMutates, findCommonParent } from '../../utils/mutationUtils'
import { ShortcutsCategory } from '../Shortcuts'

const category = new ShortcutsCategory('Search', 'Navigate search results')
export default category

// Get results and setup updating indexes on tabbing

let searchResultsAnchors: HTMLAnchorElement[] = []
let searchResultIndex = -1

let searchSuggestedAnchors: HTMLAnchorElement[] = []
let searchSuggestedIndex = -1

let updateSearchResultIndexAborts: AbortController[] = []
function updateSearchResultIndex(toIndex: number) {
  return function () {
    searchResultIndex = toIndex
  }
}

let updateSearchSuggestedIndexAborts: AbortController[] = []
function updateSearchSuggestedIndex(toIndex: number) {
  return function () {
    searchSuggestedIndex = toIndex
  }
}

function getSearchResults() {
  updateSearchResultIndexAborts.forEach((abortController) => abortController.abort())
  updateSearchSuggestedIndexAborts.forEach((abortController) => abortController.abort())
  updateSearchResultIndexAborts = []
  updateSearchSuggestedIndexAborts = []

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

  // Setup updating indexes on tabbing
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

// Setup mutations on images page

let lastMutationTimeout: ReturnType<typeof setTimeout>
const mutationWaitTimeMs = 100
function setupImageMutations() {
  // Look for the second element and not the last one like on Youtube
  // Because last element when new image results are added is incorrect before scrolling to it
  const commonParent = findCommonParent(searchResultsAnchors[0], searchResultsAnchors[1])

  // Static MutationObserver, because google pages are not dynamic (redirect causes page reload)
  whenElementMutates(commonParent, (_mutations, _observer) => {
    clearTimeout(lastMutationTimeout)
    lastMutationTimeout = setTimeout(() => {
      getSearchResults()
    }, mutationWaitTimeMs)
  }, { childList: true })
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

// On document_idle
updateSearchResults()

const searchResultScrollLength = 250

category.shortcuts.set('nextSearchResult', {
  defaultKey: 'j',
  description: 'Focus next search result / image',
  isAvailable: () => updateSearchResults(),
  event: () => {
    const lastIndex = searchResultIndex
    searchResultIndex = Math.min(searchResultIndex + 1, searchResultsAnchors.length - 1)
    if (searchResultIndex === lastIndex) return

    const currentSearchAnchor = searchResultsAnchors[searchResultIndex]
    const currentSearchAnchorRect = currentSearchAnchor.getBoundingClientRect()
    const scrollLength = Math.min(searchResultScrollLength, window.innerHeight / 2.5)
    window.scrollBy(0, currentSearchAnchorRect.top - scrollLength)
    currentSearchAnchor.focus()
  }
})

category.shortcuts.set('previousSearchResult', {
  defaultKey: 'k',
  description: 'Focus previous search result / image',
  isAvailable: () => updateSearchResults(),
  event: () => {
    const lastIndex = searchResultIndex
    searchResultIndex = Math.max(searchResultIndex - 1, 0)
    if (searchResultIndex === lastIndex) return

    const currentSearchAnchor = searchResultsAnchors[searchResultIndex]
    const currentSearchAnchorRect = currentSearchAnchor.getBoundingClientRect()
    const scrollLength = Math.min(searchResultScrollLength, window.innerHeight / 2.5)
    window.scrollBy(0, currentSearchAnchorRect.top - scrollLength)
    currentSearchAnchor.focus()
  }
})

category.shortcuts.set('firstSearchResult', {
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

category.shortcuts.set('lastSearchResult', {
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
