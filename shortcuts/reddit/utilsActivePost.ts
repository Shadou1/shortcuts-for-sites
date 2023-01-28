import { didPathnameChange } from '../../utils/locationUtils'

const didCommentsPageChange = didPathnameChange()

// Main page
let activePost: HTMLElement | null

export let activePostSubredditLink: HTMLAnchorElement | null

export let activePostImage: HTMLImageElement | null
export let activePostImageList: HTMLUListElement | null

export let activeVideoPlayer: HTMLElement | null
export let activeVideo: HTMLVideoElement | null

// Comments page
let commentsPagePost: HTMLElement | null

export let commentsPageSubredditLink: HTMLAnchorElement | null

export let commentsPageImage: HTMLImageElement | null
export let commentsPageImageList: HTMLUListElement | null

export let commentsPageVideoPlayer: HTMLElement | null
export let commentsPageVideo: HTMLVideoElement | null

export function updateCommentsPage() {
  if (didCommentsPageChange()) {
    commentsPagePost = document.querySelector('[data-test-id="post-content"]')!

    commentsPageSubredditLink = document.querySelector('a > span[title]')?.parentElement as HTMLAnchorElement | null

    commentsPageImage = commentsPagePost.querySelector('img.ImageBox-image')
    commentsPageImageList = commentsPagePost.querySelector('ul')

    commentsPageVideoPlayer = commentsPagePost.querySelector('shreddit-player')
    commentsPageVideo = commentsPageVideoPlayer?.shadowRoot!.querySelector('video') as HTMLVideoElement | null
  }

  commentsPagePost = commentsPagePost?.offsetParent ? commentsPagePost : document.querySelector('[data-test-id="post-content"]')!

  commentsPageSubredditLink = commentsPageSubredditLink ?? document.querySelector('a > span[title]')?.parentElement as HTMLAnchorElement | null

  commentsPageImage = commentsPageImage?.offsetParent ? commentsPageImage : commentsPagePost.querySelector('img.ImageBox-image')
  commentsPageImageList = commentsPageImageList?.offsetParent ? commentsPageImageList : commentsPagePost.querySelector('ul')

  commentsPageVideoPlayer = commentsPageVideoPlayer?.offsetParent ? commentsPageVideoPlayer : commentsPagePost.querySelector('shreddit-player')
  commentsPageVideo = commentsPageVideo?.offsetParent ? commentsPageVideo : commentsPageVideoPlayer?.shadowRoot!.querySelector('video') as HTMLVideoElement | null
}

// outdated functions
export function updatePostInComments() {
  if (didCommentsPageChange()) {
    commentsPagePost = document.querySelector('[data-test-id="post-content"]')
  }
  commentsPagePost = commentsPagePost?.offsetParent ? commentsPagePost : document.querySelector('[data-test-id="post-content"]')
  return commentsPagePost
}
export function updateImageInComments() {
  if (didCommentsPageChange()) {
    commentsPageImage = document.querySelector('[data-test-id="post-content"] img.ImageBox-image')
    commentsPageImageList = document.querySelector('[data-test-id="post-content"] ul')
  }
  commentsPageImage = commentsPageImage?.offsetParent ? commentsPageImage : document.querySelector('[data-test-id="post-content"] img.ImageBox-image')
  commentsPageImageList = commentsPageImageList?.offsetParent ? commentsPageImageList : document.querySelector('[data-test-id="post-content"] ul')
  return commentsPageImage ?? commentsPageImageList
}

export function updateVideoInComments() {
  if (didCommentsPageChange()) {
    commentsPageVideoPlayer = document.querySelector('[data-test-id="post-content"] shreddit-player')
    commentsPageVideo = commentsPageVideoPlayer?.shadowRoot!.querySelector('video') as HTMLVideoElement | null
  }
  // If user goes to a comments page (curent tab) then back an then back to the comments page, activeVideoPlayerInComments will now refer to a hidden element (offsetParent is null)
  // This happens because didCommentsPageChange() will return false, so need to check for ?.offsetParent
  commentsPageVideoPlayer = commentsPageVideoPlayer?.offsetParent ? commentsPageVideoPlayer : document.querySelector('[data-test-id="post-content"] shreddit-player')
  commentsPageVideo = commentsPageVideo?.offsetParent ? commentsPageVideo : commentsPageVideoPlayer?.shadowRoot!.querySelector('video') as HTMLVideoElement | null
  return commentsPageVideoPlayer?.offsetParent && commentsPageVideo?.offsetParent
}

export function updateSubredditLinkInComments() {
  if (didCommentsPageChange()) {
    commentsPageSubredditLink = document.querySelector('a > span[title]')?.parentElement as HTMLAnchorElement | null
  }
  // Here if an element's offsetParent is null, it is still valid to click on it (its href is also valid)
  commentsPageSubredditLink = commentsPageSubredditLink ?? document.querySelector('a > span[title]')?.parentElement as HTMLAnchorElement | null
  return commentsPageSubredditLink
}
// end outdated functions

export let scrollContainerComments: HTMLElement | null
export function updateScrollContainerInComments() {
  if (didCommentsPageChange()) {
    scrollContainerComments = document.querySelector('#overlayScrollContainer')
  }
  // Here if offsetParent is null, scrollContainer is not valid
  scrollContainerComments = scrollContainerComments?.offsetParent ? scrollContainerComments : document.querySelector('#overlayScrollContainer')
  return scrollContainerComments?.offsetParent
}

let isKeyboardNavigated = false
document.body.addEventListener('keydown', (event) => {
  if (event.key !== 'j' && event.key !== 'k' && event.key !== 'J' && event.key !== 'K') return
  isKeyboardNavigated = true
})

let activeComment: HTMLElement | null
const postScrollHeight = 100
const commentScrollHeight = 150
// TODO this logic should probably be in posts.ts
document.body.addEventListener('focusin', (event) => {
  // Only work when j/k J/K keys have been used
  if (!isKeyboardNavigated) return
  isKeyboardNavigated = false

  // Focus post link when post container is focused
  const eventTarget = event.target as HTMLElement | null
  if (eventTarget?.getAttribute('data-testid') === 'post-container') {

    activePost = document.activeElement as HTMLElement
    activePostImage = activePost.querySelector('img.ImageBox-image')
    activePostImageList = activePost.querySelector('ul')
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
