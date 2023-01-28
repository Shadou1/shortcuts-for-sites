import { didHrefChange, pathnameMatches } from '../../utils/locationUtils'
import { findCommonParent, whenElementMutates } from '../../utils/mutationUtils'
import { ShortcutsCategory } from '../Shortcuts'

const didPageHrefChange = didHrefChange()

const category = new ShortcutsCategory('Posts', 'Posts')
export default category

// TODO post container is not actually focusable
// let updatePostIndexAborts: AbortController[] = []
// function updatePostIndex(toIndex: number) {
//   return function () {
//     postIndex = toIndex
//   }
// }

let postContainers: HTMLElement[] = []
let postIndex = -1
function getPostContainers() {
  console.log('getting posts')
  // updatePostIndexAborts.forEach((abortController) => abortController.abort())
  // updatePostIndexAborts = []

  postContainers = [...document.querySelectorAll<HTMLElement>('[data-testid="post-container"]')]

  // postContainers.forEach((postContainer, index) => {
  //   const abortController = new AbortController()
  //   postContainer.addEventListener('focus', updatePostIndex(index), { signal: abortController.signal })
  //   updatePostIndexAborts.push(abortController)
  // })

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
function getCommentDivs() {
  console.log('getting comments')
  commentDivs = [...document.querySelectorAll<HTMLElement>('[style*="padding-left"')]
  return commentDivs
}

function focusCurrentComment() {
  const currentCommentDiv = commentDivs[commentIndex]
  console.log(currentCommentDiv)
  // if (!currentCommentDiv.offsetParent) {
  //   const visibleParent = currentCommentDiv.closest('[style]')
  //   visibleParent?.scrollIntoView()
  // }
  currentCommentDiv.focus()
}

let mutationObserverPosts: MutationObserver | null
let lastMutationTimeoutPosts: ReturnType<typeof setTimeout>
const mutationPostsWaitTimeMs = 300
function setupPostMutations() {
  const postContainersCommonParent = findCommonParent(postContainers[0], postContainers[1])

  mutationObserverPosts?.disconnect()
  mutationObserverPosts = whenElementMutates(postContainersCommonParent, (mutations, _observer) => {

    let didAddNodes = false
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        didAddNodes = true
        break
      }
    }
    if (!didAddNodes) return

    clearTimeout(lastMutationTimeoutPosts)
    lastMutationTimeoutPosts = setTimeout(() => {
      getPostContainers()
    }, mutationPostsWaitTimeMs)

  }, { childList: true })
}

let mutationObserverComments: MutationObserver | null
let lastMutationTimeoutComments: ReturnType<typeof setTimeout>
const mutationCommentsWaitTimeMs = 200
function setupCommentMutations() {
  const commentDivsCommonParent = findCommonParent(commentDivs[0], commentDivs[1])

  mutationObserverComments?.disconnect()
  mutationObserverComments = whenElementMutates(commentDivsCommonParent, (mutations, _observer) => {

    let didAddNodes = false
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        didAddNodes = true
        break
      }
    }
    if (!didAddNodes) return

    clearTimeout(lastMutationTimeoutComments)
    lastMutationTimeoutComments = setTimeout(() => {
      getCommentDivs()
    }, mutationCommentsWaitTimeMs)

  }, { childList: true })
}

function updatePostContainers() {
  const didPathChange = didPageHrefChange()
  const lastPostContainersLength = postContainers.length
  const containsPostContainer = document.contains(postContainers[0])
  if (!didPathChange && lastPostContainersLength > 1 && containsPostContainer) return postContainers.length

  postIndex = -1
  const postContainersLength = getPostContainers().length
  if (postContainersLength < 2) return postContainersLength

  setupPostMutations()
  return postContainersLength
}

function updateCommentDivs() {
  const didPathChange = didPageHrefChange()
  const lastCommentDivsLength = commentDivs.length
  const containesCommentDiv = document.contains(commentDivs[0])
  if (!didPathChange && lastCommentDivsLength > 1 && containesCommentDiv) return commentDivs.length

  commentIndex = -1
  const commentDivsLength = getCommentDivs().length
  if (commentDivsLength < 2) return commentDivsLength

  setupCommentMutations()
  return commentDivsLength
}

// TODO hidden comments cannot be scrolled to
category.shortcuts.set('focusNextPost', {
  defaultKey: 'j',
  description: 'Next post or comment',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      return updateCommentDivs()
    } else {
      return updatePostContainers()
    }
  },
  event: (ev) => {
    ev.preventDefault()
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      const prevIndex = commentIndex
      commentIndex = Math.min(commentIndex + 1, commentDivs.length - 1)
      if (commentIndex === prevIndex) return
      focusCurrentComment()
    } else {
      const prevIndex = postIndex
      postIndex = Math.min(postIndex + 1, postContainers.length - 1)
      if (postIndex === prevIndex) return
      focusCurrentPost()
    }
  }
})

category.shortcuts.set('focusPreviousPost', {
  defaultKey: 'k',
  description: 'Previous post or comment',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      return updateCommentDivs()
    } else {
      return updatePostContainers()
    }
  },
  event: (ev) => {
    ev.preventDefault()
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      const prevIndex = commentIndex
      commentIndex = Math.max(commentIndex - 1, 0)
      if (commentIndex === prevIndex) return
      focusCurrentComment()
    } else {
      const prevIndex = postIndex
      postIndex = Math.max(postIndex - 1, 0)
      if (postIndex === prevIndex) return
      focusCurrentPost()
    }
  }
})

// TODO this will not actually focus the post, moving logic from utilsActivePost.ts to here will resolve this
category.shortcuts.set('focusFirstPost', {
  defaultKey: 'K',
  description: 'First post or comment',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      return updateCommentDivs()
    } else {
      return updatePostContainers()
    }
  },
  event: (ev) => {
    ev.preventDefault()
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      if (commentIndex === 0) return
      commentIndex = 0
      focusCurrentComment()
    } else {
      if (postIndex === 0) return
      postIndex = 0
      focusCurrentPost()
    }
  }
})

category.shortcuts.set('focusLastPost', {
  defaultKey: 'J',
  description: 'Last post or comment',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      return updateCommentDivs()
    } else {
      return updatePostContainers()
    }
  },
  event: (ev) => {
    ev.preventDefault()
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      if (commentIndex === commentDivs.length - 1) return
      commentIndex = commentDivs.length - 1
      focusCurrentComment()
    } else {
      if (postIndex === postContainers.length - 1) return
      postIndex = postContainers.length - 1
      focusCurrentPost()
    }
  }
})
