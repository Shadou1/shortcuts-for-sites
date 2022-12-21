let homeAnchor = null
let popularAnchor = null

let hotPostsAnchor = null
let newPostsAnchor = null
let topPostsAnchor = null
let risingPostsAnchor = null
let timeSortAnchor = null

// Main page
let activePost = null
let activePostSubredditLink = null

let activeVideoPlayer = null
let activeVideo = null

// Comments page
let scrollContainerComments = null
let activeComment = null
let commentsPageSubredditLink = null

let activeVideoPlayerInComments = null
let activeVideoInComments = null

let didCommentsPageChange

let pathnameMatches, didPathnameChange
import(browser.runtime.getURL('utils/locationUtils.js')).then((result) => {
  ({ pathnameMatches, didPathnameChange } = result)
  didCommentsPageChange = didPathnameChange()
})

function updateVideoInComments() {
  if (didCommentsPageChange()) {
    activeVideoPlayerInComments = document.querySelector('[data-test-id="post-content"] shreddit-player')
    activeVideoInComments = activeVideoPlayerInComments.shadowRoot.querySelector('video')
  }
  // Redundantly query again if still null
  activeVideoPlayerInComments = activeVideoPlayerInComments || document.querySelector('[data-test-id="post-content"] shreddit-player')
  activeVideoInComments = activeVideoInComments || activeVideoPlayerInComments?.shadowRoot.querySelector('video')

  if (activeVideoPlayerInComments && activeVideoInComments) return true
  return false
}

function updateSubredditLinkInComments() {
  if (didCommentsPageChange()) {
    commentsPageSubredditLink = document.querySelector('a > span[title]').parentElement
  }
  commentsPageSubredditLink = commentsPageSubredditLink || document.querySelector('a > span[title]').parentElement
  if (commentsPageSubredditLink) return true
  return false
}

function updateScrollContainerInComments() {
  if (didCommentsPageChange()) {
    scrollContainerComments = document.querySelector('#overlayScrollContainer')
  }
  scrollContainerComments = scrollContainerComments || document.querySelector('#overlayScrollContainer')
  if (scrollContainerComments) return true
  return false
}

// TODO maybe rework
let isKeyboardFocused = false
document.body.addEventListener('keydown', (event) => {
  if (event.key !== 'j' && event.key !== 'k') return
  isKeyboardFocused = true
})

document.body.addEventListener('focusin', (event) => {
  // Only work when j/k keys have been used
  if (!isKeyboardFocused) return
  isKeyboardFocused = false

  // Focus post link when post container is focused
  if (event.target.getAttribute('data-testid') === 'post-container') {

    activePost = document.activeElement
    activePostSubredditLink = activePost.querySelector('a[data-click-id="subreddit"]')

    activeVideoPlayer = activePost.querySelector('shreddit-player')
    activeVideo = activeVideoPlayer?.shadowRoot.querySelector('video')

    activePost.scrollIntoView()
    const scrollLength = Math.min(150, window.innerHeight / 2)
    window.scrollBy(0, -scrollLength)

    const postLink = activePost.querySelector('a[data-click-id="body"]')
    postLink.focus()

  // Scroll to focused comment
  } else if (event.target.style.paddingLeft) {
    activeComment = document.activeElement
    activeComment.scrollIntoView()
    const scrollLength = Math.min(150, window.innerHeight / 2)
    if (updateScrollContainerInComments()) {
      scrollContainerComments.scrollTop += scrollContainerComments.scrollTop < scrollContainerComments.scrollHeight - window.innerHeight ? -scrollLength : 0
    } else {
      window.scrollBy(0, window.scrollY < document.body.scrollHeight - window.innerHeight ? -scrollLength : 0)
    }
  }

})

export const shortcuts = new Map()

shortcuts.set('goToHome', {
  category: 'General',
  defaultKey: 'o',
  description: 'Go to home',
  event: () => {
    homeAnchor = homeAnchor || document.querySelector('header a[href="/"]')
    homeAnchor?.click()
  }
})

shortcuts.set('goToPopular', {
  category: 'General',
  defaultKey: 'u',
  description: 'Go to popular',
  event: () => {
    popularAnchor = popularAnchor || document.querySelector('header a[href*="popular"]')
    popularAnchor?.click()
  }
})

shortcuts.set('goToSubreddit', {
  category: 'Post',
  defaultKey: 'i',
  description: 'Go to post\'s subreddit',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      return updateSubredditLinkInComments()
    } else {
      return activePostSubredditLink?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      commentsPageSubredditLink.click()
    } else {
      activePostSubredditLink.click()
    }
  },
})

// shortcuts.set('goToNextCommentInLevel', {
//   category: 'Post',
//   defaultKey: 'J',
//   description: 'Next comment in level',
//   event: () => {
//     if (!pathnameMatches(/^\/r\/.+?\/comments/)) return
//   },
// })

shortcuts.set('goToSubredditNewTab', {
  category: 'Post',
  defaultKey: 'I',
  description: 'Go to post\'s subreddit (new tab)',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      return updateSubredditLinkInComments()
    } else {
      return activePostSubredditLink?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      window.open(commentsPageSubredditLink.href, '_blank')
    } else {
      window.open(activePostSubredditLink.href, '_blank')
    }
  },
})

// TODO focus post (on comments page)

shortcuts.set('showHotPosts', {
  category: 'Posts filters',
  defaultKey: '1',
  description: 'Hot posts',
  isAvailable: () => {
    hotPostsAnchor = hotPostsAnchor?.offsetParent ? hotPostsAnchor : document.querySelector('a[href*="hot"][role="button"]')
    return hotPostsAnchor?.offsetParent
  },
  event: () => {
    hotPostsAnchor.click()
  }
})

shortcuts.set('showNewPosts', {
  category: 'Posts filters',
  defaultKey: '2',
  description: 'New posts',
  isAvailable: () => {
    newPostsAnchor = newPostsAnchor?.offsetParent ? newPostsAnchor : document.querySelector('a[href*="new"][role="button"]')
    return newPostsAnchor?.offsetParent
  },
  event: () => {
    newPostsAnchor.click()
  }
})

shortcuts.set('showTopPosts', {
  category: 'Posts filters',
  defaultKey: '3',
  description: 'Top posts',
  isAvailable: () => {
    topPostsAnchor = topPostsAnchor?.offsetParent ? topPostsAnchor : document.querySelector('a[href*="top"][role="button"]')
    return topPostsAnchor?.offsetParent
  },
  event: () => {
    topPostsAnchor.click()
  }
})

shortcuts.set('showRisingPosts', {
  category: 'Posts filters',
  defaultKey: '4',
  description: 'Rising posts',
  isAvailable: () => {
    // Anchor is hidden, so not checking for offsetParent
    risingPostsAnchor = risingPostsAnchor || document.querySelector('a[href*="rising"][role="menuitem"]')
    return risingPostsAnchor
  },
  event: () => {
    risingPostsAnchor.click()
  }
})

shortcuts.set('chooseTimePeriod', {
  category: 'Posts filters',
  defaultKey: 't',
  description: 'Choose time period',
  isAvailable: () => {
    timeSortAnchor = timeSortAnchor?.offsetParent ? timeSortAnchor : document.querySelector('button#TimeSort--SortPicker')
    return timeSortAnchor?.offsetParent
  },
  event: () => {
    timeSortAnchor.click()
  }
})

// TODO Add go to first/last post shortcuts
// TODO add focus sidebar

shortcuts.set('videoPauseResume', {
  category: 'Video',
  defaultKey: ';',
  description: 'Pause/resume',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      return updateVideoInComments()
    } else {
      return activeVideoPlayer?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {

      if (activeVideoInComments.readyState === 0) {
        const playButton = activeVideoPlayerInComments.shadowRoot.querySelector('vds-play-button icon-play')
        playButton?.click()
        activeVideoInComments.addEventListener('canplay', () => activeVideoInComments.play(), { once: true })
        return
      }

      if (activeVideoInComments.paused) activeVideoInComments.play()
      else activeVideoInComments.pause()

    } else {
      if (activeVideo.paused) activeVideo.play()
      else activeVideo.pause()
    }
  }
})

shortcuts.set('videoRewind', {
  category: 'Video',
  defaultKey: '[',
  description: 'Rewind',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      return updateVideoInComments()
    } else {
      return activeVideoPlayer?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      activeVideoInComments.fastSeek(activeVideoInComments.currentTime - 5)
    } else {
      activeVideo.fastSeek(activeVideo.currentTime - 5)
    }
  }
})

shortcuts.set('videoForward', {
  category: 'Video',
  defaultKey: ']',
  description: 'Fast forward',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      return updateVideoInComments()
    } else {
      return activeVideoPlayer?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      activeVideoInComments.fastSeek(activeVideoInComments.currentTime + 5)
    } else {
      activeVideo.fastSeek(activeVideo.currentTime + 5)
    }
  }
})

// TODO add full screen shortcut
// 'f': {
//   category: 'Video',
//   description: 'Full screen',
//   event: () => {
//     if (!activeVideo) return

//   }
// },

shortcuts.set('videoMute', {
  category: 'Video',
  defaultKey: 'm',
  description: 'Mute',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      return updateVideoInComments()
    } else {
      return activeVideoPlayer?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      activeVideoInComments.muted = !activeVideoInComments.muted
    } else {
      activeVideo.muted = !activeVideo.muted
    }
  }
})

shortcuts.set('videoVolumeUp', {
  category: 'Video',
  defaultKey: '+',
  description: 'Volume up',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      return updateVideoInComments()
    } else {
      return activeVideoPlayer?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      activeVideoInComments.volume = Math.max(0, Math.min(1, activeVideoInComments.volume + 0.05))
    } else {
      activeVideo.volume = Math.max(0, Math.min(1, activeVideo.volume + 0.05))
    }
  }
})

shortcuts.set('videoVolumeDown', {
  category: 'Video',
  defaultKey: '-',
  description: 'Volume down',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      return updateVideoInComments()
    } else {
      return activeVideoPlayer?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      activeVideoInComments.volume = Math.max(0, Math.min(1, activeVideoInComments.volume - 0.05))
    } else {
      activeVideo.volume = Math.max(0, Math.min(1, activeVideo.volume - 0.05))
    }
  }
})

// TODO add show timeline shortcuts
// TODO add quality settings shortcuts
