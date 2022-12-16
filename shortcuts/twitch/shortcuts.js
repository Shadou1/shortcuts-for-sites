let homeAnchor = null
let followingAnchor = null
let browseAnchor = null
let settingsButton = null // inconsistent
let qualityButton = null // inconsistent
let chatTextarea = null // inconsistent
let collapseLeftNavButton = null // inconsistent
let collapseChatButton = null // inconsistent

let pathnameStartsWith, pathnameEndsWith
import(browser.runtime.getURL('utils/locationUtils.js')).then((result) => {
  ({ pathnameStartsWith, pathnameEndsWith } = result)
})

let whenTargetMutates
import(browser.runtime.getURL('utils/mutationUtils.js')).then((result) => {
  ({ whenTargetMutates } = result)
})

let focusFirstChannel,
  focusFirstVideo,
  focusFirstVideoOnQueryType,
  focusFirstCategory,
  navigateToLiveChannels,
  navigateToVideos,
  navigateToSchedule
import(browser.runtime.getURL('shortcuts/twitch/utils.js')).then((result) => {
  ({
    focusFirstChannel,
    focusFirstVideo,
    focusFirstVideoOnQueryType,
    focusFirstCategory,
    navigateToLiveChannels,
    navigateToVideos,
    navigateToSchedule,
  } = result)
})

export const shortcuts = new Map()

shortcuts.set('expandLeftSidebar', {
  category: 'General',
  defaultKey: 'E',
  description: 'Expand/collapse left sidebar',
  event: () => {
    // collapseLeftNavButton = collapseLeftNavButton || document.querySelector('button[data-a-target="side-nav-arrow"]')
    collapseLeftNavButton = document.querySelector('button[data-a-target="side-nav-arrow"]')
    collapseLeftNavButton.click()
  }
})

shortcuts.set('focusFollowedChannels', {
  category: 'General',
  defaultKey: 'u',
  description: 'Focus followed channels',
  event: () => {
    // collapseLeftNavButton = collapseLeftNavButton || document.querySelector('button[data-a-target="side-nav-arrow"]')
    const firstFollowedChannel = document.querySelector('#side-nav .tw-transition-group a[data-test-selector="followed-channel"]')
    firstFollowedChannel?.focus()
  }
})

shortcuts.set('focusRecommendedChannels', {
  category: 'General',
  defaultKey: 'r',
  description: 'Focus recommended channels',
  event: () => {
    // collapseLeftNavButton = collapseLeftNavButton || document.querySelector('button[data-a-target="side-nav-arrow"]')
    const firstRecommendedChannel = document.querySelector('#side-nav .tw-transition-group a[data-test-selector="recommended-channel"]')
    firstRecommendedChannel?.focus()
  }
})

shortcuts.set('goToHome', {
  category: 'General',
  defaultKey: 'o',
  description: 'Go to home',
  event: () => {
    if (window.location.pathname !== '/') {
      homeAnchor = homeAnchor || document.querySelector('a[data-a-target="home-link"]')
      homeAnchor?.click()
      whenTargetMutates('main', focusFirstVideoOnQueryType('home'))
    } else {
      focusFirstVideoOnQueryType('home')()
    }
  }
})

shortcuts.set('goToFollowing', {
  category: 'General',
  defaultKey: 'U',
  description: 'Go to following',
  event: () => {
    if (!pathnameEndsWith('/following')) {
      followingAnchor = followingAnchor || document.querySelector('a[data-a-target="following-link"]')
      followingAnchor?.click()
      whenTargetMutates('main', focusFirstVideoOnQueryType('following'))
    } else {
      focusFirstVideoOnQueryType('following')()
    }
  }
})

shortcuts.set('goToCategories', {
  category: 'General',
  defaultKey: 'b',
  description: 'Browse categories',
  event: () => {
    if (pathnameEndsWith('/directory/all')) {
      const categoriesAnchor = document.querySelector('a[data-a-target="browse-type-tab-categories"]')
      categoriesAnchor?.click()
      // Sometimes it does not mutate and callback will execute wrongly
      const isFocused = focusFirstCategory()
      if (!isFocused) whenTargetMutates('main', focusFirstCategory)
    } else if (!pathnameEndsWith('/directory')) {
      browseAnchor = browseAnchor || document.querySelector('a[data-a-target="browse-link"]')
      browseAnchor?.click()
      whenTargetMutates('main', focusFirstCategory)
    } else {
      focusFirstCategory()
    }
  }
})

shortcuts.set('goToLiveChannels', {
  category: 'General',
  defaultKey: 'B',
  description: 'Browse live channels',
  event: () => {
    if (!pathnameEndsWith('/directory/all')) {
      if (pathnameEndsWith('/directory')) {
        navigateToLiveChannels()
      } else {
        browseAnchor = browseAnchor || document.querySelector('a[data-a-target="browse-link"]')
        browseAnchor?.click()
        whenTargetMutates('main', navigateToLiveChannels)
      }
    } else {
      focusFirstVideoOnQueryType('browse')()
    }
  }
})

shortcuts.set('openVideoSettings', {
  category: 'Stream',
  defaultKey: 's',
  description: 'Open settings',
  event: () => {
    const allSettingsButtons = document.querySelectorAll('#channel-player button[data-a-target="player-settings-button"]')
    settingsButton = allSettingsButtons[allSettingsButtons.length - 1]
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
  event: () => {
    const allSettingsButtons = document.querySelectorAll('#channel-player button[data-a-target="player-settings-button"]')
    settingsButton = allSettingsButtons[allSettingsButtons.length - 1]
    settingsButton.click()
    qualityButton = document.querySelector('div[data-a-target="player-settings-menu"] button[data-a-target="player-settings-menu-item-quality"]')
    qualityButton.click()
    const currentQualityInput = document.querySelector('div[data-a-target="player-settings-menu"] input[checked=""]')
    currentQualityInput.focus()
  }
})

shortcuts.set('goToStreamCategory', {
  category: 'Stream',
  defaultKey: 'C',
  description: 'Go to stream category',
  event: () => {
    if (window.location.pathname === '/') return

    if (pathnameStartsWith('/directory')) {
      focusFirstChannel()
      return
    }

    const streamGameAnchor = document.querySelector('a[data-a-target="stream-game-link"]')
    if (!streamGameAnchor) return
    streamGameAnchor.click()
    whenTargetMutates('main', focusFirstChannel)
  }
})

shortcuts.set('scrollToStreamDescription', {
  category: 'Stream',
  defaultKey: 'd',
  description: 'Scroll to description/video',
  event: () => {
    const streamInformatinoSection = document.querySelector('.channel-info-content section#live-channel-stream-information')
    if (document.activeElement !== streamInformatinoSection) {
      streamInformatinoSection.focus()
      // TODO first time scrolling will work incorrectly
      streamInformatinoSection.scrollIntoView()
    } else {
      streamInformatinoSection.blur()
      const video = document.querySelector('video')
      video.scrollIntoView()
    }
  }
})

shortcuts.set('focusChatBox', {
  category: 'Chat',
  defaultKey: 'c',
  description: 'Chat',
  event: () => {
    // chatTextarea = chatTextarea || document.querySelector('textarea[data-a-target="chat-input"]')
    chatTextarea = document.querySelector('[data-a-target="chat-input"]')
    chatTextarea.focus()
  }
})

shortcuts.set('expandChat', {
  category: 'Chat',
  defaultKey: 'e',
  description: 'Expand/collapse chat',
  event: () => {
    // collapseChatButton = collapseChatButton || document.querySelector('button[data-a-target="right-column__toggle-collapse-btn"]')
    collapseChatButton = document.querySelector('button[data-a-target="right-column__toggle-collapse-btn"]')
    collapseChatButton.click()
  }
})

shortcuts.set('goToOfflineChannel', {
  category: 'Channel',
  defaultKey: 'h',
  description: 'Go to online/offline channel sections',
  event: () => {
    const offlineSection = document.querySelector('#offline-channel-main-content')
    const channelAnchor = document.querySelector('#live-channel-stream-information a:not([href^="/directory"], [data-a-target="stream-game-link"]), #offline-channel-main-content a')
    channelAnchor.click()
    if (!offlineSection) {
      whenTargetMutates('main', focusFirstVideoOnQueryType('channel home'))
    }
  }
})

shortcuts.set('goToChannelVideos', {
  category: 'Channel',
  defaultKey: 'v',
  description: 'Go to channel videos',
  event: () => {
    const videosAnchor = document.querySelector('a[tabname="videos"]')
    if (videosAnchor) {
      if (pathnameEndsWith('/videos')) {
        const firstVideo = document.querySelector('[data-test-selector="preview-card-carousel-child-container"] a')
        firstVideo.focus()
      } else {
        videosAnchor.click()
        whenTargetMutates('main', focusFirstVideoOnQueryType('channel video'))
      }
    } else {
      const channelAnchor = document.querySelector('#live-channel-stream-information a:not([href^="/directory"], .tw-link, [data-test-selector="clips-watch-full-button"]), #offline-channel-main-content a')
      channelAnchor.click()
      whenTargetMutates('main', navigateToVideos)
    }
  }
})

shortcuts.set('goToChannelSchedule', {
  category: 'Channel',
  defaultKey: 'S',
  description: 'Go to channel schedule',
  event: () => {
    const scheduleAnchor = document.querySelector('a[tabname="schedule"]')
    if (scheduleAnchor) {
      if (pathnameEndsWith('/schedule')) {
        scheduleAnchor.focus()
      } else {
        scheduleAnchor.click()
        scheduleAnchor.focus()
      }
    } else {
      const channelAnchor = document.querySelector('#live-channel-stream-information a:not([href^="/directory"]):not(.tw-link):not([data-test-selector="clips-watch-full-button"]), #offline-channel-main-content a')
      channelAnchor.click()
      whenTargetMutates('main', navigateToSchedule)
    }
  }
})

shortcuts.set('expandMiniPlayer', {
  category: 'Mini player',
  defaultKey: 'x',
  description: 'Expand mini player',
  event: () => {
    const expandPlayerButton = document.querySelector('[data-a-player-state="mini"] .player-overlay-background > div:nth-child(2) button')
    expandPlayerButton?.click()
  }
})

shortcuts.set('closeMiniPlayer', {
  category: 'Mini player',
  defaultKey: 'X',
  description: 'Close mini player',
  event: () => {
    const closePlayerButton = document.querySelector('[data-a-player-state="mini"] .player-overlay-background > div:first-child button')
    closePlayerButton?.click()
  }
})

// Predictions
// button[data-test-selector="community-prediction-highlight-header__action-button"]
