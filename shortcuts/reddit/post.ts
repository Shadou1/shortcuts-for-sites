import { ShortcutsCategory } from '../Shortcuts'
import { pathnameMatches } from '../../utils/locationUtils'
import {
  activePostImage,
  activePostImageList,
  activePostSubredditLink,
  commentsPageImage,
  commentsPageImageList,
  commentsPagePost,
  commentsPageSubredditLink,
  commentsPageVideoPlayer,
  scrollContainerComments,
  updateCommentsPage,
  updateScrollContainerInComments,
} from './utilsActivePost'
import { openLinkInNewTab } from '../../utils/linkUtils'

const category = new ShortcutsCategory('Post', 'Post')
export default category

category.shortcuts.set('goToSubredditNewTab', {
  defaultKey: 'b',
  description: 'Go to post\'s subreddit (new tab)',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      updateCommentsPage()
      return commentsPageSubredditLink?.offsetParent
    } else {
      return activePostSubredditLink?.offsetParent
    }
  },
  event: () => {
    let linkHref
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      linkHref = commentsPageSubredditLink!.href
    } else {
      linkHref = activePostSubredditLink!.href
    }
    openLinkInNewTab(linkHref)
  },
})

// category.shortcuts.set('goToNextCommentInLevel', {
//   defaultKey: 'J',
//   description: 'Next comment in level',
//   event: () => {
//     if (!pathnameMatches(/^\/r\/.+?\/comments/)) return
//   },
// })

category.shortcuts.set('openPostImageNewTab', {
  defaultKey: 'g',
  description: 'Open post image (new tab)',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      updateCommentsPage()
      return commentsPageImage?.offsetParent ?? commentsPageImageList?.offsetParent
    } else {
      return activePostImage?.offsetParent ?? activePostImageList?.offsetParent
    }
  },
  event: () => {
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
    }
    openLinkInNewTab(imageSrc)
  }
})

category.shortcuts.set('goToSubreddit', {
  defaultKey: 'B',
  description: 'Go to post\'s subreddit (this tab)',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      updateCommentsPage()
      return commentsPageSubredditLink?.offsetParent
    } else {
      return activePostSubredditLink?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      commentsPageSubredditLink!.click()
    } else {
      activePostSubredditLink!.click()
    }
  },
})

// TODO event and isAvailable logic is identical to openPostImageNewTab
category.shortcuts.set('openPostImage', {
  defaultKey: 'G',
  description: 'Open post image (this tab)',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      updateCommentsPage()
      return commentsPageImage?.offsetParent ?? commentsPageImageList?.offsetParent
    } else {
      return activePostImage?.offsetParent ?? activePostImageList?.offsetParent
    }
  },
  event: () => {
    let imageSrc: string
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      if (commentsPageImage) {
        imageSrc = commentsPageImage.src
      } else {
        const selectedImage = commentsPageImageList!.querySelector<HTMLImageElement>('li[style="left: 0px;"] img')!
        imageSrc = selectedImage.src
      }
    } else {
      if (activePostImage) {
        imageSrc = activePostImage.src
      } else {
        const selectedImage = activePostImageList!.querySelector<HTMLImageElement>('li[style="left: 0px;"] img')!
        imageSrc = selectedImage.src
      }
    }

    // NOTE dangerous code, make sure the link is correct
    if (imageSrc.startsWith('https://preview.redd.it/')) {
      imageSrc = imageSrc.replace(/^https:\/\/preview\.redd\.it\//, 'https://i.redd.it/')
      imageSrc = imageSrc.replace(/\?.*$/, '')
    }
    // TODO maybe extract this into openLinkInThisTab
    const tempAnchor = document.createElement('a')
    tempAnchor.href = imageSrc
    tempAnchor.click()
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
    const nearestAnchor =  commentsPagePostFocusableElement!.querySelector('a') ?? commentsPagePostFocusableElement!.closest('a')
    nearestAnchor?.focus()
    const rect = commentsPagePostFocusableElement!.getBoundingClientRect()
    if (updateScrollContainerInComments()) {
      scrollContainerComments!.scrollBy(0, rect.top - commentsPagePostScrollLength)
    } else {
      window.scrollBy(0, rect.top - commentsPagePostScrollLength)
    }
  }
})
