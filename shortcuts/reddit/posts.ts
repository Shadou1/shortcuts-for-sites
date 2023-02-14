import { getSetupUpdateIndexOnFocus } from '../../utils/focusUtils'
import { getChangeIndex } from '../../utils/indexUtils'
import { didHrefChange, pathnameMatches } from '../../utils/locationUtils'
import { findCommonParent, getSetupMutations, whenElementMutates } from '../../utils/mutationUtils'
import { ShortcutsCategory } from '../Shortcuts'
import { activeComment, focusComment, getPostData } from './utilsActivePost'

const didHrefChangePosts = didHrefChange()
const didHrefChangeComments = didHrefChange()

const category = new ShortcutsCategory('Posts', 'Posts and comments')
export default category

let postContainers: HTMLElement[] = []
let postLinks: (HTMLAnchorElement | null)[] = []
let postIndex = -1
let changePostIndex: ReturnType<typeof getChangeIndex>
const setupUpdatePostIndexOnFocus = getSetupUpdateIndexOnFocus((index) => {
  postIndex = index
  getPostData(postContainers[postIndex])
})

function getPostContainers() {
  postContainers = [...document.querySelectorAll<HTMLElement>('[data-testid="post-container"]')]
  changePostIndex = getChangeIndex(postContainers)
  // post container is not actually focusable
  postLinks = postContainers.map((postContainer) => {
    const postLink = postContainer.querySelector<HTMLAnchorElement>('a[data-click-id="body"]')
    const searchResultLink = postContainer.querySelector('[data-testid="post-container"] [data-testid="post-title"]')?.parentElement as HTMLAnchorElement | null
    const pollButton = postContainer.querySelector<HTMLAnchorElement>('button[aria-label]:not(.voteButton):not([disabled])')
    return postLink ?? searchResultLink ?? pollButton
  })
  setupUpdatePostIndexOnFocus(postLinks)
  return postContainers
}

const postScrollHeight = 100
export function focusPostLink(postIndex: number) {
  const postContainer = postContainers[postIndex]
  const activePostRect = postContainer.getBoundingClientRect()
  const scrollLength = Math.min(postScrollHeight, window.innerHeight / 2)
  window.scrollBy(0, activePostRect.top - scrollLength)

  postLinks[postIndex]?.focus()
}

function focusCurrentPost() {
  const currentPostContainer = postContainers[postIndex]
  if (!currentPostContainer.offsetParent) {
    whenElementMutates(currentPostContainer.parentElement!, (_mutations, observer) => {
      observer.disconnect()
      setTimeout(() => focusPostLink(postIndex), 0)
    }, { attributes: true })
    const visibleParent = currentPostContainer.closest('[style]')
    visibleParent?.scrollIntoView()
  } else {
    focusPostLink(postIndex)
  }
}

let commentDivs: HTMLElement[] = []
let commentIndex = -1
let changeCommentIndex: ReturnType<typeof getChangeIndex>

function getCommentDivs() {
  commentDivs = [...document.querySelectorAll<HTMLElement>('[style*="padding-left"]')]
  changeCommentIndex = getChangeIndex(commentDivs, { skip: (el) => !el.offsetParent })
  return commentDivs
}

function focusCurrentComment() {
  const currentCommentDiv = commentDivs[commentIndex]
  focusComment(currentCommentDiv)
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

function focusPostOrComment(which: 'next' | 'previous' | 'first' | 'last') {
  if (pathnameMatches(/^\/r\/.+?\/comments/)) {
    // const prevIndex = commentIndex
    commentIndex = changeCommentIndex(which, commentIndex)
    // if (commentIndex === prevIndex) return
    focusCurrentComment()
  } else {
    // const prevIndex = postIndex
    postIndex = changePostIndex(which, postIndex)
    // if (postIndex === prevIndex) return
    focusCurrentPost()
  }
}

category.initialize = () => {
  // Enter is a native shortcut for opening the current post, but it only works if the post
  // was focused using native j/k shortcust, and if the user focuses any other element and presses Enter
  // it will instead open the current post
  const ingoredNativeShortcuts = ['Enter', 'j', 'k', 'J', 'K', 'l']
  const shortcutFocusableDiv = document.querySelector('#SHORTCUT_FOCUSABLE_DIV')

  // keypress event.stopImmediatePropagation() will disable j/k and other shortcuts,
  // but after pressing the '?' key it will work once (sometimes, wtf), so safer to also call event.preventDefault()
  // the same thing will happen with the 'Enter' key (it will work once after pressing the '?' key)

  // FIXME enter key not working in toolbar (because it depends on native 'Enter' shortcut)
  shortcutFocusableDiv?.addEventListener('keypress', (event) => {
    if (ingoredNativeShortcuts.includes((event as KeyboardEvent).key)) {
      event.stopImmediatePropagation()
    }
  }, { capture: true })

  shortcutFocusableDiv?.addEventListener('keydown', (event) => {
    if (ingoredNativeShortcuts.includes((event as KeyboardEvent).key)) {
      event.stopImmediatePropagation()
    }
  }, { capture: true })
}

category.shortcuts.set('focusNextPost', {
  defaultKey: 'j',
  description: 'Next post or comment',
  isAvailable: isPostsNavigationAvailable,
  event: (ev) => {
    ev.preventDefault()
    focusPostOrComment('next')
  }
})

category.shortcuts.set('focusPreviousPost', {
  defaultKey: 'k',
  description: 'Previous post or comment',
  isAvailable: isPostsNavigationAvailable,
  event: (ev) => {
    ev.preventDefault()
    focusPostOrComment('previous')
  }
})

category.shortcuts.set('focusFirstPost', {
  defaultKey: 'K',
  description: 'First post or comment',
  isAvailable: isPostsNavigationAvailable,
  event: (ev) => {
    ev.preventDefault()
    focusPostOrComment('first')
  }
})

category.shortcuts.set('focusLastPost', {
  defaultKey: 'J',
  description: 'Last post or comment',
  isAvailable: isPostsNavigationAvailable,
  event: (ev) => {
    ev.preventDefault()
    focusPostOrComment('last')
  }
})

category.shortcuts.set('collapseComment', {
  defaultKey: 'Enter',
  description: 'Collapse/expand comment',
  isAvailable: () => activeComment?.offsetParent,
  event: () => {
    // show more replies paragraph is not focusable, so the focus will be on document.body
    // also clicking on a moreRepliesParagraph will not allow the Enter key to click on any other element
    if (document.activeElement !== document.body) return
    const moreRepliesParagraph = activeComment!.querySelector('p')
    moreRepliesParagraph?.click()
  }
})
