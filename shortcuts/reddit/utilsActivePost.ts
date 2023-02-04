import styles from './style.module.css'
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
export let commentsPagePost: HTMLElement | null

export let commentsPageSubredditLink: HTMLAnchorElement | null

export let commentsPageImage: HTMLImageElement | null
export let commentsPageImageList: HTMLUListElement | null

export let commentsPageVideoPlayer: HTMLElement | null
export let commentsPageVideo: HTMLVideoElement | null

export let activeComment: HTMLElement | null

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

export let scrollContainerComments: HTMLElement | null
export function updateScrollContainerInComments() {
  if (didCommentsPageChange()) {
    scrollContainerComments = document.querySelector('#overlayScrollContainer')
  }
  // Here if offsetParent is null, scrollContainer is not valid
  scrollContainerComments = scrollContainerComments?.offsetParent ? scrollContainerComments : document.querySelector('#overlayScrollContainer')
  return scrollContainerComments?.offsetParent
}

// TODO maybe query posts data only once when getPostContainers is called
export function getPostData(postContainer: HTMLElement) {
  activePost = postContainer
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
}

function clickCollapseButtonCallback() {
  const collapseButton = activeComment?.querySelector('button')
  setTimeout(() => collapseButton?.focus(), 0)
}

const commentScrollHeight = 150
let lastActiveComment: HTMLElement | null = null
export function focusComment(commentDiv: HTMLElement) {
  activeComment = commentDiv
  const activeCommentRect = activeComment.getBoundingClientRect()
  const scrollLength = Math.min(commentScrollHeight, window.innerHeight / 2)
  if (updateScrollContainerInComments()) {
    scrollContainerComments!.scrollBy(0, activeCommentRect.top - scrollLength)
  } else {
    window.scrollBy(0, activeCommentRect.top - scrollLength)
  }

  // NOTE problems with last comment being an A tag and .focus()
  if (lastActiveComment === activeComment) return

  const activeCommentDiv = activeComment.querySelector(':scope > .Comment:nth-child(2)')
  if (activeCommentDiv) {
    activeCommentDiv.classList.toggle(styles.focusedComment, true)
    const collapseButton = activeCommentDiv.querySelector('button')
    collapseButton?.focus()
    collapseButton?.addEventListener('click', clickCollapseButtonCallback)
  } else {
    const commentLink = activeComment.querySelector<HTMLElement>(':is(a, p)')
    commentLink?.classList.toggle(styles.focusedComment, true)
    commentLink?.focus()
  }

  const lastActiveCommentDiv = lastActiveComment?.querySelector(':scope > .Comment:nth-child(2)')
  if (lastActiveCommentDiv) {
    lastActiveCommentDiv.classList.toggle(styles.focusedComment, false)
    const collapseButton = lastActiveCommentDiv.querySelector('button')
    collapseButton?.blur()
    collapseButton?.removeEventListener('click', clickCollapseButtonCallback)
  } else {
    const commentLink = lastActiveComment?.querySelector<HTMLElement>(':is(a, p)')
    commentLink?.classList.toggle(styles.focusedComment, false)
    commentLink?.blur()
  }

  lastActiveComment = activeComment
}
