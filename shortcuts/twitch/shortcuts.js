let pathnameStartsWith, pathnameEndsWith, didHrefChange
let whenElementMutates, whenElementMutatesQuery
let didPageHrefChange
// TODO use bundler to import these functions with 'import {} from'
Promise.all([
  import(browser.runtime.getURL('utils/locationUtils.js')),
  import(browser.runtime.getURL('utils/mutationUtils.js')),
]).then(([locationUtils, mutationUtils]) => {
  ({ pathnameStartsWith, pathnameEndsWith, didHrefChange } = locationUtils);
  ({ whenElementMutates, whenElementMutatesQuery } = mutationUtils)
  didPageHrefChange = didHrefChange()
  // Relevant anchors won't be loaded when this function is called
  // updateRelevantAnchors()
})

let focusFirstChannel,
  focusFirstVideoOnQueryType,
  focusFirstCategory,
  navigateToLiveChannels,
  navigateToVideos,
  navigateToSchedule
import(browser.runtime.getURL('shortcuts/twitch/utils.js')).then((result) => {
  ({
    focusFirstChannel,
    focusFirstVideoOnQueryType,
    focusFirstCategory,
    navigateToLiveChannels,
    navigateToVideos,
    navigateToSchedule,
  } = result)
})

export const shortcuts = new Map()

let collapseLeftNavButton = null
shortcuts.set('expandLeftSidebar', {
  category: 'Sidebar',
  defaultKey: 'E',
  description: 'Expand/collapse left sidebar',
  event: () => {
    // collapseLeftNavButton = collapseLeftNavButton || document.querySelector('button[data-a-target="side-nav-arrow"]')
    collapseLeftNavButton = document.querySelector('button[data-a-target="side-nav-arrow"]')
    collapseLeftNavButton.click()
  }
})

shortcuts.set('focusFollowedChannels', {
  category: 'Sidebar',
  defaultKey: 'u',
  description: 'Focus followed channels',
  event: () => {
    // collapseLeftNavButton = collapseLeftNavButton || document.querySelector('button[data-a-target="side-nav-arrow"]')
    const firstFollowedChannel = document.querySelector('#side-nav .tw-transition-group a[data-test-selector="followed-channel"]')
    firstFollowedChannel?.focus()
  }
})

shortcuts.set('focusRecommendedChannels', {
  category: 'Sidebar',
  defaultKey: 'r',
  description: 'Focus recommended channels',
  event: () => {
    // collapseLeftNavButton = collapseLeftNavButton || document.querySelector('button[data-a-target="side-nav-arrow"]')
    const firstRecommendedChannel = document.querySelector('#side-nav .tw-transition-group a[data-test-selector="recommended-channel"]')
    firstRecommendedChannel?.focus()
  }
})

let relevantAnchors = []
let showMoreRelevantButtons = []
let relevantAnchorIndex = -1
let relevantAnchorScrollHeight = 120
let relevantAnchorScrollHeightHomePageAdjustment = 100
let isOnHomePage // Scroll height on channel pages must be adjusted
let scrollAndFocusCurrentRelevantAnchor
let updateRelevantAnchorsAborts = []
function updateRelevantAnchorIndex(toIndex) {
  return function () {
    relevantAnchorIndex = toIndex
  }
}

// Should get streams, videos, clips, categories
function getRelevantAnchors() {
  updateRelevantAnchorsAborts.forEach((abortController) => abortController.abort())
  updateRelevantAnchorsAborts = []

  const twTowersAndShowMoreButtons = document.querySelectorAll(':is([data-test-selector="view-all"], .tw-tower, .show-more__move-up button)')

  showMoreRelevantButtons = []
  let relevantAnchorsParents = []
  for (let i = 0; i < twTowersAndShowMoreButtons.length; i++) {
    const currentTower = twTowersAndShowMoreButtons[i]
    if (!currentTower.classList.contains('tw-tower')) continue

    let showMoreButton
    if (twTowersAndShowMoreButtons[i - 1]?.tagName === 'H5') {
      showMoreButton = twTowersAndShowMoreButtons[i - 1]
    } else if (twTowersAndShowMoreButtons[i + 1]?.tagName === 'BUTTON') {
      showMoreButton = twTowersAndShowMoreButtons[i + 1]
    }
    // Page will not have new showMore buttons when towers mutate
    // However it is necessary to push new references to showMoreRelevantButtons when new relevantAnchors are added
    currentTower.querySelectorAll(':is(article, .game-card)').forEach((relevantParent) => {
      if (!relevantParent.offsetParent) return
      showMoreRelevantButtons.push(showMoreButton)
      relevantAnchorsParents.push(relevantParent)
    })
  }
  // console.log('showMoreButtons', showMoreRelevantButtons)

  // Selectors in order:
  // streams, categories, clips and videos
  relevantAnchors = []
  relevantAnchorsParents.forEach((relevantAnchorParent) => relevantAnchors.push(relevantAnchorParent.querySelector(`:is(
    a.tw-link[data-test-selector="TitleAndChannel"],
    [data-test-selector="tw-card-title"] a.tw-link,
    a.tw-link[lines]
  )`)))
  // console.log('relevantAnchors', relevantAnchors)

  const rootScrollContentElement = relevantAnchorsParents[0]?.closest('.simplebar-scroll-content')
  scrollAndFocusCurrentRelevantAnchor = () => {
    const scrollHeight = isOnHomePage ? relevantAnchorScrollHeight + relevantAnchorScrollHeightHomePageAdjustment : relevantAnchorScrollHeight
    const rect = relevantAnchorsParents[relevantAnchorIndex].getBoundingClientRect()
    rootScrollContentElement.scrollBy(0, rect.top - scrollHeight)
    relevantAnchors[relevantAnchorIndex].focus()
  }

  relevantAnchors.forEach((relevantAnchor, index) => {
    const abortController = new AbortController()
    relevantAnchor.addEventListener('focus', updateRelevantAnchorIndex(index), { signal: abortController.signal })
    updateRelevantAnchorsAborts.push(abortController)
  })

  return relevantAnchors
}

// const placeholders = document.querySelectorAll(`:not(.game-card) > :is(
//   .tw-card,
//   [class*="TowerPlaceholder"]
// )`)

let mutationObservers = []
let lastMutationTimeout
let mutationWaitTimeMs = 100
function setupRelevantAnchorsMutations() {
  // .tw-tower elements have all the relevant anchors and anchors that can become visible later
  const twTowers = document.querySelectorAll('.tw-tower')

  mutationObservers.forEach((observer) => observer.disconnect())
  twTowers.forEach((tower) => {
    const mutationObserver = whenElementMutates(tower, (_mutations, _observer) => {
      if (!tower.offsetParent) return

      let didAddNodes = false
      outer: for (let mutation of _mutations) {
        if (mutation.addedNodes.length) {
          didAddNodes = true
          break outer
        }
      }
      if (!didAddNodes) return

      clearTimeout(lastMutationTimeout)
      lastMutationTimeout = setTimeout(() => {
        getRelevantAnchors()
      }, mutationWaitTimeMs)
    }, { childList: true })
    mutationObservers.push(mutationObserver)
  })
}

function updateRelevantAnchors() {
  const didPathChange = didPageHrefChange()
  const lastRelevantAnchorsLength = relevantAnchors.length
  const lastRelevantAnchorVisible = relevantAnchors[0]?.offsetParent
  if (!didPathChange && lastRelevantAnchorsLength !== 0 && lastRelevantAnchorVisible) return relevantAnchors.length
  // Bellow only runs if we need to setup new mutation observer

  const relevantAnchorsLength = getRelevantAnchors().length
  if (!relevantAnchorsLength) return relevantAnchorsLength

  isOnHomePage = document.querySelector('.home-header-sticky')

  relevantAnchorIndex = -1
  setupRelevantAnchorsMutations()

  return relevantAnchorsLength
}

shortcuts.set('focusNextRelevant', {
  category: 'Relevant content (stream, video...)',
  defaultKey: ']',
  description: 'Focus next relevant',
  isAvailable: () => updateRelevantAnchors(),
  event: () => {
    const prevIndex = relevantAnchorIndex
    relevantAnchorIndex = Math.min(relevantAnchorIndex + 1, relevantAnchors.length - 1)
    if (relevantAnchorIndex === prevIndex) return
    scrollAndFocusCurrentRelevantAnchor()
  }
})

shortcuts.set('focusPreviousRelevant', {
  category: 'Relevant content (stream, video...)',
  defaultKey: '[',
  description: 'Focus previous relevant',
  isAvailable: () => updateRelevantAnchors(),
  event: () => {
    const prevIndex = relevantAnchorIndex
    relevantAnchorIndex = Math.max(relevantAnchorIndex - 1, 0)
    if (relevantAnchorIndex === prevIndex) return
    scrollAndFocusCurrentRelevantAnchor()
  }
})

shortcuts.set('focusFirstRelevant', {
  category: 'Relevant content (stream, video...)',
  defaultKey: '{',
  description: 'Focus first relevant',
  isAvailable: () => updateRelevantAnchors(),
  event: () => {
    if (relevantAnchorIndex === 0) return
    relevantAnchorIndex = 0
    scrollAndFocusCurrentRelevantAnchor()
  }
})

shortcuts.set('focusLastRelevant', {
  category: 'Relevant content (stream, video...)',
  defaultKey: '}',
  description: 'Focus last relevant',
  isAvailable: () => updateRelevantAnchors(),
  event: () => {
    if (relevantAnchorIndex === relevantAnchors.length - 1) return
    relevantAnchorIndex = relevantAnchors.length - 1
    scrollAndFocusCurrentRelevantAnchor()
  }
})

shortcuts.set('showMoreViewAll', {
  category: 'Relevant content (stream, video...)',
  defaultKey: '\\',
  description: 'Show more / all',
  isAvailable: () => showMoreRelevantButtons[relevantAnchorIndex],
  event: () => {
    showMoreRelevantButtons[relevantAnchorIndex].click()
  }
})

// TODO on home page, add shortcuts to press right/left arrows, or handle them somehow

let homeAnchor = null
let followingAnchor = null
let browseAnchor = null

shortcuts.set('goToHome', {
  category: 'Navigation',
  defaultKey: 'o',
  description: 'Go to home',
  event: () => {
    if (window.location.pathname !== '/') {
      homeAnchor = homeAnchor || document.querySelector('a[data-a-target="home-link"]')
      homeAnchor?.click()
      whenElementMutatesQuery('main', focusFirstVideoOnQueryType('home'))
    } else {
      focusFirstVideoOnQueryType('home')()
    }
  }
})

shortcuts.set('goToFollowing', {
  category: 'Navigation',
  defaultKey: 'U',
  description: 'Go to following',
  event: () => {
    if (!pathnameEndsWith('/following')) {
      followingAnchor = followingAnchor || document.querySelector('a[data-a-target="following-link"]')
      followingAnchor?.click()
      whenElementMutatesQuery('main', focusFirstVideoOnQueryType('following'))
    } else {
      focusFirstVideoOnQueryType('following')()
    }
  }
})

shortcuts.set('goToCategories', {
  category: 'Navigation',
  defaultKey: 'b',
  description: 'Browse categories',
  event: () => {
    if (pathnameEndsWith('/directory/all')) {
      const categoriesAnchor = document.querySelector('a[data-a-target="browse-type-tab-categories"]')
      categoriesAnchor?.click()
      // Sometimes it does not mutate and callback will execute wrongly
      const isFocused = focusFirstCategory()
      if (!isFocused) whenElementMutatesQuery('main', focusFirstCategory)
    } else if (!pathnameEndsWith('/directory')) {
      browseAnchor = browseAnchor || document.querySelector('a[data-a-target="browse-link"]')
      browseAnchor?.click()
      whenElementMutatesQuery('main', focusFirstCategory)
    } else {
      focusFirstCategory()
    }
  }
})

shortcuts.set('goToLiveChannels', {
  category: 'Navigation',
  defaultKey: 'B',
  description: 'Browse live channels',
  event: () => {
    if (!pathnameEndsWith('/directory/all')) {
      if (pathnameEndsWith('/directory')) {
        navigateToLiveChannels()
      } else {
        browseAnchor = browseAnchor || document.querySelector('a[data-a-target="browse-link"]')
        browseAnchor?.click()
        whenElementMutatesQuery('main', navigateToLiveChannels)
      }
    } else {
      focusFirstVideoOnQueryType('browse')()
    }
  }
})

// all inconsistent
let settingsButton = null
let qualityButton = null
let streamGameAnchor = null
let streamInformationSection = null

shortcuts.set('openVideoSettings', {
  category: 'Stream',
  defaultKey: 's',
  description: 'Open settings',
  isAvailable: () => {
    const allSettingsButtons = document.querySelectorAll('#channel-player button[data-a-target="player-settings-button"]')
    if (!allSettingsButtons.length) return false
    settingsButton = allSettingsButtons[allSettingsButtons.length - 1]
    return settingsButton?.offsetParent
  },
  event: () => {
    settingsButton.click()
    // qualityButton = qualityButton || document.querySelector('div[data-a-target="player-settings-menu"] button[data-a-target="player-settings-menu-item-quality"]')
    qualityButton = document.querySelector('div[data-a-target="player-settings-menu"] button[data-a-target="player-settings-menu-item-quality"]')
    qualityButton.focus()
  }
})

shortcuts.set('openVideoQualitySettings', {
  category: 'Stream',
  defaultKey: 'q',
  description: 'Open quality settings',
  isAvailable: () => {
    const allSettingsButtons = document.querySelectorAll('#channel-player button[data-a-target="player-settings-button"]')
    if (!allSettingsButtons.length) return false
    settingsButton = allSettingsButtons[allSettingsButtons.length - 1]
    return settingsButton?.offsetParent
  },
  event: () => {
    settingsButton.click()
    qualityButton = document.querySelector('div[data-a-target="player-settings-menu"] button[data-a-target="player-settings-menu-item-quality"]')
    qualityButton.click()
    const currentQualityInput = document.querySelector('div[data-a-target="player-settings-menu"] input[checked=""]')
    currentQualityInput.focus()
  }
})

// TODO make it also go to currenly selected relevant anchor stream category
shortcuts.set('goToStreamCategory', {
  category: 'Stream',
  defaultKey: 'C',
  description: 'Go to stream category',
  isAvailable: () => {
    if (window.location.pathname === '/') return false
    if (pathnameStartsWith('/directory/game')) return true
    streamGameAnchor = document.querySelector('a[data-a-target="stream-game-link"]')
    return streamGameAnchor?.offsetParent
  },
  event: () => {
    if (pathnameStartsWith('/directory/game')) {
      focusFirstChannel()
      return
    }

    streamGameAnchor.click()
    whenElementMutatesQuery('main', focusFirstChannel)
  }
})

shortcuts.set('scrollToStreamDescription', {
  category: 'Stream',
  defaultKey: 'd',
  description: 'Scroll to description/video',
  isAvailable: () => {
    streamInformationSection = document.querySelector('.channel-info-content section#live-channel-stream-information')
    return streamInformationSection?.offsetParent
  },
  event: () => {
    if (document.activeElement !== streamInformationSection) {
      streamInformationSection.focus()
      // TODO first time scrolling will work incorrectly
      streamInformationSection.scrollIntoView()
    } else {
      streamInformationSection.blur()
      const video = document.querySelector('video')
      video.scrollIntoView()
    }
  }
})

let chatTextarea = null
let collapseChatButton = null

shortcuts.set('focusChatBox', {
  category: 'Chat',
  defaultKey: 'c',
  description: 'Chat',
  isAvailable: () => {
    chatTextarea = document.querySelector('[data-a-target="chat-input"]')
    return chatTextarea?.offsetParent
  },
  event: () => {
    chatTextarea.focus()
  }
})

shortcuts.set('expandChat', {
  category: 'Chat',
  defaultKey: 'e',
  description: 'Expand/collapse chat',
  isAvailable: () => {
    collapseChatButton = document.querySelector('button[data-a-target="right-column__toggle-collapse-btn"]')
    return collapseChatButton?.offsetParent
  },
  event: () => {
    collapseChatButton.click()
  }
})

let channelAnchor = null
let videosAnchor = null
let scheduleAnchor = null

shortcuts.set('goToOfflineChannel', {
  category: 'Channel',
  defaultKey: 'h',
  description: 'Go to online/offline channel sections',
  isAvailable: () => {
    channelAnchor = document.querySelector('#live-channel-stream-information a:not([href^="/directory"], [data-a-target="stream-game-link"]), #offline-channel-main-content a')
    return channelAnchor?.offsetParent
  },
  event: () => {
    const offlineSection = document.querySelector('#offline-channel-main-content')
    channelAnchor.click()
    if (!offlineSection) {
      whenElementMutatesQuery('main', focusFirstVideoOnQueryType('channel home'))
    }
  }
})

// TODO when window.location.search is not null, make it go back to just /videos
shortcuts.set('goToChannelVideos', {
  category: 'Channel',
  defaultKey: 'v',
  description: 'Go to channel videos',
  isAvailable: () => {
    videosAnchor = document.querySelector('a[tabname="videos"]')
    if (videosAnchor?.offsetParent) return true
    channelAnchor = document.querySelector('#live-channel-stream-information a:not([href^="/directory"], .tw-link, [data-test-selector="clips-watch-full-button"]), #offline-channel-main-content a')
    return channelAnchor?.offsetParent
  },
  event: () => {
    if (videosAnchor) {
      if (pathnameEndsWith('/videos')) {
        const firstVideo = document.querySelector('[data-test-selector="preview-card-carousel-child-container"] a')
        firstVideo.focus()
      } else {
        videosAnchor.click()
        whenElementMutatesQuery('main', focusFirstVideoOnQueryType('channel video'))
      }
    } else {
      channelAnchor.click()
      whenElementMutatesQuery('main', navigateToVideos)
    }
  }
})

shortcuts.set('goToChannelSchedule', {
  category: 'Channel',
  defaultKey: 'S',
  description: 'Go to channel schedule',
  isAvailable: () => {
    scheduleAnchor = document.querySelector('a[tabname="schedule"]')
    if (scheduleAnchor?.offsetParent) return true
    channelAnchor = document.querySelector('#live-channel-stream-information a:not([href^="/directory"]):not(.tw-link):not([data-test-selector="clips-watch-full-button"]), #offline-channel-main-content a')
    return channelAnchor?.offsetParent
  },
  event: () => {
    if (scheduleAnchor) {
      if (pathnameEndsWith('/schedule')) {
        scheduleAnchor.focus()
      } else {
        scheduleAnchor.click()
        scheduleAnchor.focus()
      }
    } else {
      channelAnchor.click()
      whenElementMutatesQuery('main', navigateToSchedule)
    }
  }
})

// TODO add filter by shortcuts

let expandMiniPlayerButton = null
let closeMiniPlayerButton = null

shortcuts.set('expandMiniPlayer', {
  category: 'Mini player',
  defaultKey: 'x',
  description: 'Expand mini player',
  isAvailable: () => {
    expandMiniPlayerButton = document.querySelector('[data-a-player-state="mini"] .player-overlay-background > div:nth-child(2) button')
    return expandMiniPlayerButton?.offsetParent
  },
  event: () => {
    expandMiniPlayerButton.click()
  }
})

shortcuts.set('closeMiniPlayer', {
  category: 'Mini player',
  defaultKey: 'X',
  description: 'Close mini player',
  isAvailable: () => {
    closeMiniPlayerButton = document.querySelector('[data-a-player-state="mini"] .player-overlay-background > div:first-child button')
    return closeMiniPlayerButton?.offsetParent
  },
  event: () => {
    closeMiniPlayerButton.click()
  }
})

// Predictions
// button[data-test-selector="community-prediction-highlight-header__action-button"]
