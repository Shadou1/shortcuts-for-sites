import { getSetupUpdateIndexOnFocus } from '../../utils/focusUtils'
import { getChangeIndex } from '../../utils/indexUtils'
import { didHrefChange, pathnameMatches } from '../../utils/locationUtils'
import { findCommonParent, getSetupMutations } from '../../utils/mutationUtils'
import { ShortcutsCategory } from '../Shortcuts'

const didHrefChangePosts = didHrefChange()
const didHrefChangeComments = didHrefChange()

const category = new ShortcutsCategory('Posts', 'Posts')
export default category

let postContainers: HTMLElement[] = []
let postIndex = -1
let changePostIndex: ReturnType<typeof getChangeIndex>
const setupUpdatePostIndexOnFocus = getSetupUpdateIndexOnFocus((index) => postIndex = index)

function getPostContainers() {
  postContainers = [...document.querySelectorAll<HTMLElement>('[data-testid="post-container"]')]
  changePostIndex = getChangeIndex(postContainers)
  // post container is not actually focusable
  const postLinks = postContainers.map((postContainer) => postContainer.querySelector<HTMLElement>('a[data-click-id="body"]')!)
  setupUpdatePostIndexOnFocus(postLinks)
  return postContainers
}

function focusCurrentPost() {
  const currentPostContainer = postContainers[postIndex]
  if (!currentPostContainer.offsetParent) {
    const visibleParent = currentPostContainer.closest('[style]')
    visibleParent?.scrollIntoView()
  }
  currentPostContainer.focus()
}

let commentDivs: HTMLElement[] = []
let commentIndex = -1
let changeCommentIndex: ReturnType<typeof getChangeIndex>

function getCommentDivs() {
  commentDivs = [...document.querySelectorAll<HTMLElement>('[style*="padding-left"')]
  changeCommentIndex = getChangeIndex(commentDivs, { skip: (el) => !el.offsetParent })
  return commentDivs
}

function focusCurrentComment() {
  const currentCommentDiv = commentDivs[commentIndex]
  currentCommentDiv.focus()
  // TODO add focus collapse comment button
}

const [setupPostMutations] = getSetupMutations(getPostContainers, {
  mutationWaitTimeMs: 300,
})

const [setupCommentMutations] = getSetupMutations(getCommentDivs)

function updatePostContainers() {
  const didPathChange = didHrefChangePosts()
  const lastPostContainersLength = postContainers.length
  const containsPostContainer = document.contains(postContainers[0])
  if (!didPathChange && lastPostContainersLength > 1 && containsPostContainer) return postContainers.length

  postIndex = -1
  const postContainersLength = getPostContainers().length
  if (postContainersLength < 2) return postContainersLength

  const postContainersCommonParent = findCommonParent(postContainers[0], postContainers[1])
  setupPostMutations(postContainersCommonParent)
  return postContainersLength
}

function updateCommentDivs() {
  const didPathChange = didHrefChangeComments()
  const lastCommentDivsLength = commentDivs.length
  const containesCommentDiv = document.contains(commentDivs[0])
  if (!didPathChange && lastCommentDivsLength > 1 && containesCommentDiv) return commentDivs.length

  commentIndex = -1
  const commentDivsLength = getCommentDivs().length
  if (commentDivsLength < 2) return commentDivsLength

  const commentDivsCommonParent = findCommonParent(commentDivs[0], commentDivs[1])
  setupCommentMutations(commentDivsCommonParent)
  return commentDivsLength
}

function isPostsNavigationAvailable() {
  if (pathnameMatches(/^\/r\/.+?\/comments/)) {
    return updateCommentDivs()
  } else {
    return updatePostContainers()
  }
}

function focusPostOrComment(event: Event, which: 'next' | 'previous' | 'first' | 'last') {
  event.preventDefault()
  if (pathnameMatches(/^\/r\/.+?\/comments/)) {
    const prevIndex = commentIndex
    commentIndex = changeCommentIndex(which, commentIndex)
    if (commentIndex === prevIndex) return
    focusCurrentComment()
  } else {
    const prevIndex = postIndex
    postIndex = changePostIndex(which, postIndex)
    if (postIndex === prevIndex) return
    focusCurrentPost()
  }
}

category.shortcuts.set('focusNextPost', {
  defaultKey: 'j',
  description: 'Next post or comment',
  isAvailable: isPostsNavigationAvailable,
  event: (ev) => {
    focusPostOrComment(ev, 'next')
  }
})

category.shortcuts.set('focusPreviousPost', {
  defaultKey: 'k',
  description: 'Previous post or comment',
  isAvailable: isPostsNavigationAvailable,
  event: (ev) => {
    focusPostOrComment(ev, 'previous')
  }
})

// TODO this will not actually focus the post, moving logic from utilsActivePost.ts to here will resolve this
category.shortcuts.set('focusFirstPost', {
  defaultKey: 'K',
  description: 'First post or comment',
  isAvailable: isPostsNavigationAvailable,
  event: (ev) => {
    focusPostOrComment(ev, 'first')
  }
})

category.shortcuts.set('focusLastPost', {
  defaultKey: 'J',
  description: 'Last post or comment',
  isAvailable: isPostsNavigationAvailable,
  event: (ev) => {
    focusPostOrComment(ev, 'last')
  }
})
