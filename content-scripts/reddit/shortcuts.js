let homeAnchor = null
let popularAnchor = null

let activePost = null
let activeVideo = null

let currentNavigationTarget = null
let whenTargetMutates;
(async () => {
  ({ whenTargetMutates } = await import(browser.runtime.getURL('utils/mutationUtils.js')))
})()

// focus post link when post container is focused
document.body.addEventListener('focusin', (event) => {
  if (event.target.getAttribute('data-testid') !== 'post-container') return

  activePost = document.activeElement

  // const activePostImage = activePost.querySelector('.media-element')
  // activePostImage?.scrollIntoView()

  activeVideo = activePost.querySelector('video')
  // activeVideo?.scrollIntoView()

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
      if (!activeVideo) return

      if (activeVideo.ended) {
        const replayVideoButton = activePost.querySelector('button > span.replay-video')
        replayVideoButton.click()
      }
      else if (activeVideo.paused) activeVideo.play()
      else activeVideo.pause()
    }
  },

  '[': {
    category: 'Video',
    description: 'Rewind',
    event: () => {
      if (!activeVideo) return

      activeVideo.fastSeek(activeVideo.currentTime - 5)
    }
  },

  ']': {
    category: 'Video',
    description: 'Fast forward',
    event: () => {
      if (!activeVideo) return

      activeVideo.fastSeek(activeVideo.currentTime + 5)
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

  // TODO on next video or when replaying current video mute/volume settings will reset
  'm': {
    category: 'Video',
    description: 'Mute',
    event: () => {
      if (!activeVideo) return

      activeVideo.muted = !activeVideo.muted
    }
  },

  '+': {
    category: 'Video',
    description: 'Volume up',
    event: () => {
      if (!activeVideo) return

      activeVideo.volume = Math.max(0, Math.min(1, activeVideo.volume + 0.05))
      // const volumeDiv = activeVideo.querySelector('div[style*="height"]')
      // volumeDiv.style.height = `${postVideo.volume * 100}%`
      // volumeDiv.click()
    }
  },

  '-': {
    category: 'Video',
    description: 'Volume down',
    event: () => {
      if (!activeVideo) return

      activeVideo.volume = Math.max(0, Math.min(1, activeVideo.volume - 0.05))
      // const volumeDiv = activeVideo.querySelector('div[style*="height"]')
      // volumeDiv.style.height = `${postVideo.volume * 100}%`
      // volumeDiv.click()
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
