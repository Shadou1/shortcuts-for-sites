import { didPathnameChange } from '../../utils/locationUtils'

const didCommentsPageChange = didPathnameChange()

// Main page
let activePost: HTMLElement | null
export let activePostSubredditLink: HTMLAnchorElement | null

export let activeVideoPlayer: HTMLElement | null
export let activeVideo: HTMLVideoElement | null

// Comments page
let scrollContainerComments: HTMLElement | null
let activeComment: HTMLElement | null
export let commentsPageSubredditLink: HTMLAnchorElement | null

export let activeVideoPlayerInComments: HTMLElement | null
export let activeVideoInComments: HTMLVideoElement | null

export function updateVideoInComments() {
  if (didCommentsPageChange()) {
    activeVideoPlayerInComments = document.querySelector('[data-test-id="post-content"] shreddit-player')
    activeVideoInComments = activeVideoPlayerInComments?.shadowRoot!.querySelector('video') as HTMLVideoElement | null
  }
  // If user goes to a comments page (curent tab) then back an then back to the comments page, activeVideoPlayerInComments will now refer to a hidden element (offsetParent is null)
  // This happens because didCommentsPageChange() will return false, so need to check for ?.offsetParent
  activeVideoPlayerInComments = activeVideoPlayerInComments?.offsetParent ? activeVideoPlayerInComments : document.querySelector('[data-test-id="post-content"] shreddit-player')
  activeVideoInComments = activeVideoInComments?.offsetParent ? activeVideoInComments : activeVideoPlayerInComments?.shadowRoot!.querySelector('video') as HTMLVideoElement | null
  return activeVideoPlayerInComments?.offsetParent && activeVideoInComments?.offsetParent
}

export function updateSubredditLinkInComments() {
  if (didCommentsPageChange()) {
    commentsPageSubredditLink = document.querySelector('a > span[title]')?.parentElement as HTMLAnchorElement | null
  }
  // Here if an element's offsetParent is null, it is still valid to click on it (its href is also valid)
  commentsPageSubredditLink = commentsPageSubredditLink ?? document.querySelector('a > span[title]')?.parentElement as HTMLAnchorElement | null
  return commentsPageSubredditLink
}

function updateScrollContainerInComments() {
  if (didCommentsPageChange()) {
    scrollContainerComments = document.querySelector('#overlayScrollContainer')
  }
  // Here if offsetParent is null, scrollContainer is not valid
  scrollContainerComments = scrollContainerComments?.offsetParent ? scrollContainerComments : document.querySelector('#overlayScrollContainer')
  return scrollContainerComments?.offsetParent
}

let isKeyboardNavigated = false
document.body.addEventListener('keydown', (event) => {
  if (event.key !== 'j' && event.key !== 'k') return
  isKeyboardNavigated = true
})

const postScrollHeight = 100
const commentScrollHeight = 150
document.body.addEventListener('focusin', (event) => {
  // Only work when j/k keys have been used
  if (!isKeyboardNavigated) return
  isKeyboardNavigated = false

  // Focus post link when post container is focused
  const eventTarget = event.target as HTMLElement | null
  if (eventTarget?.getAttribute('data-testid') === 'post-container') {

    activePost = document.activeElement as HTMLElement
    activePostSubredditLink = activePost.querySelector('a[data-click-id="subreddit"]')

    activeVideoPlayer = activePost.querySelector('shreddit-player')
    if (!activeVideoPlayer) {
      // Posts on home pages have videos without shadow dom
      activeVideoPlayer = activePost.querySelector('[data-isvideoplayer="1"]')
      activeVideo = activeVideoPlayer?.querySelector('video') as HTMLVideoElement | null
    } else {
      activeVideo = activeVideoPlayer.shadowRoot!.querySelector('video')
    }

    const activePostRect = activePost.getBoundingClientRect()
    const scrollLength = Math.min(postScrollHeight, window.innerHeight / 2)
    window.scrollBy(0, activePostRect.top - scrollLength)

    const postLink = activePost.querySelector<HTMLAnchorElement>('a[data-click-id="body"]')!
    postLink.focus()

  // Scroll to focused comment
  } else if (eventTarget?.style.paddingLeft) {
    activeComment = document.activeElement as HTMLElement
    const activeCommentRect = activeComment.getBoundingClientRect()
    const scrollLength = Math.min(commentScrollHeight, window.innerHeight / 2)
    if (updateScrollContainerInComments()) {
      scrollContainerComments!.scrollBy(0, activeCommentRect.top - scrollLength)
    } else {
      window.scrollBy(0, activeCommentRect.top - scrollLength)
    }
  }

})
