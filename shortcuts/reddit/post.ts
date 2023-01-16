import { ShortcutsCategory } from '../Shortcuts'
import { pathnameMatches } from '../../utils/locationUtils'
import {
  activePostSubredditLink,
  commentsPageSubredditLink,
  updateSubredditLinkInComments
} from './utilsActivePost'

const category = new ShortcutsCategory('Post', 'Post')
export default category

category.shortcuts.set('goToSubreddit', {
  defaultKey: 'i',
  description: 'Go to post\'s subreddit',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      return updateSubredditLinkInComments()
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

// category.shortcuts.set('goToNextCommentInLevel', {
//   defaultKey: 'J',
//   description: 'Next comment in level',
//   event: () => {
//     if (!pathnameMatches(/^\/r\/.+?\/comments/)) return
//   },
// })

category.shortcuts.set('goToSubredditNewTab', {
  defaultKey: 'I',
  description: 'Go to post\'s subreddit (new tab)',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      return updateSubredditLinkInComments()
    } else {
      return activePostSubredditLink?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      window.open(commentsPageSubredditLink!.href, '_blank')
    } else {
      window.open(activePostSubredditLink!.href, '_blank')
    }
  },
})

// TODO add focus post (on comments page)
