import { ShortcutsCategory } from '../Shortcuts'
import { pathnameMatches } from '../../utils/locationUtils'
import {
  activePostImage,
  activePostImageList,
  activePostLink,
  activePostSubredditLink,
  commentsPageImage,
  commentsPageImageList,
  commentsPagePost,
  commentsPagePostLink,
  commentsPageSubredditLink,
  commentsPageVideoPlayer,
  scrollContainerComments,
  updateCommentsPage,
  updateScrollContainerInComments,
} from './utilsActivePost'
import { openLinkInNewTab, openLinkInThisTab } from '../../utils/linkUtils'

const category = new ShortcutsCategory('Post', 'Post')
export default category

function isGoToSubredditAvailable() {
  if (pathnameMatches(/^\/r\/.+?\/comments/)) {
    updateCommentsPage()
    return commentsPageSubredditLink?.offsetParent
  } else {
    return activePostSubredditLink?.offsetParent
  }
}

function getSubredditLinkHref() {
  let postLinkHref
  if (pathnameMatches(/^\/r\/.+?\/comments/)) {
    postLinkHref = commentsPageSubredditLink?.href
  } else {
    postLinkHref = activePostSubredditLink?.href
  }
  return postLinkHref
}

function isOpenPostImageAvailable() {
  if (pathnameMatches(/^\/r\/.+?\/comments/)) {
    updateCommentsPage()
    return commentsPageImage?.offsetParent ?? commentsPageImageList?.offsetParent
  } else {
    return activePostImage?.offsetParent ?? activePostImageList?.offsetParent
  }
}

function getPostImageSrc() {
  let imageSrc: string
  if (pathnameMatches(/^\/r\/.+?\/comments/)) {
    if (commentsPageImage) {
      imageSrc = commentsPageImage.src
    } else {
      const selectedImage = commentsPageImageList!.querySelector<HTMLImageElement>('li[style*="0px"] img')!
      imageSrc = selectedImage.src
    }
  } else {
    if (activePostImage) {
      imageSrc = activePostImage.src
    } else {
      const selectedImage = activePostImageList!.querySelector<HTMLImageElement>('li[style*="0px"] img')!
      imageSrc = selectedImage.src
    }
  }

  // NOTE dangerous code, make sure the link is correct
  if (imageSrc.startsWith('https://preview.redd.it/')) {
    imageSrc = imageSrc.replace(/^https:\/\/preview\.redd\.it\//, 'https://i.redd.it/')
    imageSrc = imageSrc.replace(/\?.*$/, '')
  // if link starts with this string, try to use post link href instead
  } else if (imageSrc.startsWith('https://external-preview.redd.it/')) {
    imageSrc = getPostLinkHref() ?? imageSrc
  }

  return imageSrc
}

function isOpenPostLinkAvailable() {
  if (pathnameMatches(/^\/r\/.+?\/comments/)) {
    updateCommentsPage()
    return commentsPagePostLink?.offsetParent
  } else {
    return activePostLink?.offsetParent
  }
}

function getPostLinkHref() {
  let postLinkHref
  if (pathnameMatches(/^\/r\/.+?\/comments/)) {
    postLinkHref = commentsPagePostLink?.href
  } else {
    postLinkHref = activePostLink?.href
  }
  return postLinkHref
}

category.shortcuts.set('goToSubredditNewTab', {
  defaultKey: 'b',
  description: 'Go to post\'s subreddit (new tab)',
  isAvailable: isGoToSubredditAvailable,
  event: () => {
    const postLinkHref = getSubredditLinkHref()!
    openLinkInNewTab(postLinkHref)
  },
})

category.shortcuts.set('openPostImageNewTab', {
  defaultKey: 'g',
  description: 'Open post image (new tab)',
  isAvailable: isOpenPostImageAvailable,
  event: () => {
    const imageSrc = getPostImageSrc()
    openLinkInNewTab(imageSrc)
  }
})

category.shortcuts.set('openPostLinkNewTab', {
  defaultKey: 'l',
  description: 'Open post link (new tab)',
  isAvailable: isOpenPostLinkAvailable,
  event: (ev) => {
    ev.preventDefault()
    // NOTE post link already has target=_blank
    // but in case they change it later
    const postLinkHref = getPostLinkHref()!
    openLinkInNewTab(postLinkHref)
  }
})

category.shortcuts.set('goToSubreddit', {
  defaultKey: 'B',
  description: 'Go to post\'s subreddit (this tab)',
  isAvailable: isGoToSubredditAvailable,
  event: () => {
    // same thing, post's subreddit link already opens in this tab when clicking on it
    // but in case they change it later
    const postLinkHref = getSubredditLinkHref()!
    openLinkInNewTab(postLinkHref)
  },
})

category.shortcuts.set('openPostImage', {
  defaultKey: 'G',
  description: 'Open post image (this tab)',
  isAvailable: isOpenPostImageAvailable,
  event: () => {
    const imageSrc = getPostImageSrc()
    openLinkInThisTab(imageSrc)
  }
})

category.shortcuts.set('openPostLink', {
  defaultKey: 'L',
  description: 'Open post link (this tab)',
  isAvailable: isOpenPostLinkAvailable,
  event: (ev) => {
    ev.preventDefault()
    const postLinkHref = getPostLinkHref()!
    openLinkInThisTab(postLinkHref)
  }
})

const commentsPagePostScrollLength = 200
let commentsPagePostFocusableElement: HTMLElement | null
category.shortcuts.set('focusPostOnCommentsPage', {
  defaultKey: 'f',
  description: 'Focus post on comments page',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      updateCommentsPage()
      commentsPagePostFocusableElement = commentsPageImage ?? commentsPageImageList ?? commentsPageVideoPlayer ?? commentsPagePost?.querySelector('a') as HTMLElement | null
      return commentsPagePostFocusableElement?.offsetParent
    }
    return false
  },
  event: () => {
    const nearestAnchor = commentsPagePostFocusableElement!.querySelector('a') ?? commentsPagePostFocusableElement!.closest('a')
    nearestAnchor?.focus()
    const rect = commentsPagePostFocusableElement!.getBoundingClientRect()
    if (updateScrollContainerInComments()) {
      scrollContainerComments!.scrollBy(0, rect.top - commentsPagePostScrollLength)
    } else {
      window.scrollBy(0, rect.top - commentsPagePostScrollLength)
    }
  }
})
