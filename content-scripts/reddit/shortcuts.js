let homeAnchor = null
let popularAnchor = null

// Main page
let activePost = null
let activePostSubredditLink = null

let activeVideoPlayer = null
let activeVideo = null

// Comments page
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

// Focus post link when post container is focused
document.body.addEventListener('focusin', (event) => {
  if (event.target.getAttribute('data-testid') !== 'post-container') return

  activePost = document.activeElement
  activePostSubredditLink = activePost.querySelector('a[data-click-id="subreddit"]')

  // const activePostImage = activePost.querySelector('.media-element')
  // activePostImage?.scrollIntoView()

  activeVideoPlayer = activePost.querySelector('shreddit-player')
  // activeVideo?.scrollIntoView()
  activeVideo = activeVideoPlayer?.shadowRoot.querySelector('video')
  // activePlayButton = activeVideoPlayer?.shadowRoot.querySelector('vds-play-button')

  // const scrollLength = Math.min(150, window.innerHeight / 2)
  // window.scrollBy(0, window.scrollY < document.body.scrollHeight - window.innerHeight ? -scrollLength : -100)
  activePost.scrollIntoView()
  window.scrollBy(0, -150)

  const postLink = activePost.querySelector('a[data-click-id="body"]')
  postLink.focus()
})

const shortcuts = {

  'o': {
    category: 'General',
    description: 'Go to home',
    event: () => {
      homeAnchor = homeAnchor || document.querySelector('header a[href="/"]')
      homeAnchor?.click()
    }
  },

  'u': {
    category: 'General',
    description: 'Go to popular',
    event: () => {
      popularAnchor = popularAnchor || document.querySelector('header a[href*="popular"]')
      popularAnchor?.click()
    }
  },

  'i': {
    category: 'Post',
    description: 'Go to post\'s subreddit',
    event: () => {
      if (pathnameMatches(/^\/r\/.+?\/comments/)) {
        if (!updateSubredditLinkInComments()) return
        commentsPageSubredditLink.click()
      } else {
        activePostSubredditLink?.click()
      }
    }
  },

  'I': {
    category: 'Post',
    description: 'Go to post\'s subreddit (new tab)',
    verbatum: 'Shift+i',
    event: () => {
      if (pathnameMatches(/^\/r\/.+?\/comments/)) {
        if (!updateSubredditLinkInComments()) return
        window.open(commentsPageSubredditLink.href, '_blank')
      } else {
        if (!activePostSubredditLink) return
        window.open(activePostSubredditLink.href, '_blank')
      }
    }
  },

  '1': {
    category: 'Posts filters',
    description: 'Hot posts',
    event: () => {
      const hotPostsAnchor = document.querySelector('a[href*="hot"][role="button"]')
      hotPostsAnchor?.click()
    }
  },

  '2': {
    category: 'Posts filters',
    description: 'New posts',
    event: () => {
      const newPostsAnchor = document.querySelector('a[href*="new"][role="button"]')
      newPostsAnchor?.click()
    }
  },

  '3': {
    category: 'Posts filters',
    description: 'Top posts',
    event: () => {
      const topPostsAnchor = document.querySelector('a[href*="top"][role="button"]')
      topPostsAnchor?.click()
    }
  },

  '4': {
    category: 'Posts filters',
    description: 'Rising posts',
    event: () => {
      const risingPostsAnchor = document.querySelector('a[href*="rising"][role="menuitem"]')
      risingPostsAnchor?.click()
    }
  },

  't': {
    category: 'Posts filters',
    description: 'Choose time period',
    event: () => {
      const timeSortAnchor = document.querySelector('button#TimeSort--SortPicker')
      timeSortAnchor?.click()
    }
  },

  // Add go to first/last post shortcuts

  // TODO
  // '.': {
  //   category: 'Post page',
  //   description: 'Focus current post',
  //   event: () => {
  //     activePost = activePost || document.querySelector('[data-testid="post-container"] [data-test-id="post-content"]')
  //     activePost?.focus()
  //     // activePost?.scrollIntoView()
  //   }
  // },
  // TODO add focus sidebar
  // TODO add go to subreddit of current post

  // TODO shortcuts wont work on post page (comments page)
  ';': {
    category: 'Video',
    description: 'Pause/resume',
    event: () => {
      if (pathnameMatches(/^\/r\/.+?\/comments/)) {
        if (!updateVideoInComments()) return

        if (activeVideoInComments.readyState === 0) {
          const playButton = activeVideoPlayerInComments.shadowRoot.querySelector('vds-play-button icon-play')
          playButton?.click()
          activeVideoInComments.addEventListener('canplay', () => activeVideoInComments.play(), { once: true })
          return
        }

        if (activeVideoInComments.paused) activeVideoInComments.play()
        else activeVideoInComments.pause()

      } else {
        if (!activeVideoPlayer) return
        if (activeVideo.paused) activeVideo.play()
        else activeVideo.pause()
      }
    }
  },

  '[': {
    category: 'Video',
    description: 'Rewind',
    event: () => {
      if (pathnameMatches(/^\/r\/.+?\/comments/)) {
        if (!updateVideoInComments()) return
        activeVideoInComments.fastSeek(activeVideoInComments.currentTime - 5)
      } else {
        if (!activeVideoPlayer) return
        activeVideo.fastSeek(activeVideo.currentTime - 5)
      }
    }
  },

  ']': {
    category: 'Video',
    description: 'Fast forward',
    event: () => {
      if (pathnameMatches(/^\/r\/.+?\/comments/)) {
        if (!updateVideoInComments()) return
        activeVideoInComments.fastSeek(activeVideoInComments.currentTime + 5)
      } else {
        if (!activeVideoPlayer) return
        activeVideo.fastSeek(activeVideo.currentTime + 5)
      }
    }
  },

  // TODO add full screen shortcut
  // 'f': {
  //   category: 'Video',
  //   description: 'Full screen',
  //   event: () => {
  //     if (!activeVideo) return

  //   }
  // },

  'm': {
    category: 'Video',
    description: 'Mute',
    event: () => {
      if (pathnameMatches(/^\/r\/.+?\/comments/)) {
        if (!updateVideoInComments()) return
        activeVideoInComments.muted = !activeVideoInComments.muted
      } else {
        if (!activeVideoPlayer) return
        activeVideo.muted = !activeVideo.muted
      }
    }
  },

  '+': {
    category: 'Video',
    description: 'Volume up',
    event: () => {
      if (pathnameMatches(/^\/r\/.+?\/comments/)) {
        if (!updateVideoInComments()) return
        activeVideoInComments.volume = Math.max(0, Math.min(1, activeVideoInComments.volume + 0.05))
      } else {
        if (!activeVideoPlayer) return
        activeVideo.volume = Math.max(0, Math.min(1, activeVideo.volume + 0.05))
      }
    }
  },

  '-': {
    category: 'Video',
    description: 'Volume down',
    event: () => {
      if (pathnameMatches(/^\/r\/.+?\/comments/)) {
        if (!updateVideoInComments()) return
        activeVideoInComments.volume = Math.max(0, Math.min(1, activeVideoInComments.volume - 0.05))
      } else {
        if (!activeVideoPlayer) return
        activeVideo.volume = Math.max(0, Math.min(1, activeVideo.volume - 0.05))
      }
    }
  },

  // TODO add quality settings shortcuts

}

shortcuts[Symbol.for('categoryOrder')] = [
  'General',
  'Posts filters',
  'Video'
]

Object.assign(keyboardOnlyNavigation.shortcuts, shortcuts)
