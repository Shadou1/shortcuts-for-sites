import { ShortcutsCategory } from '../Shortcuts'
import { pathnameMatches } from '../../utils/locationUtils'
import {
  activeVideo,
  commentsPageVideo,
  activeVideoPlayer,
  commentsPageVideoPlayer,
  updateCommentsPage
} from './utilsActivePost'

const category = new ShortcutsCategory('Video', 'Video')
export default category

category.shortcuts.set('videoPauseResume', {
  defaultKey: ';',
  description: 'Pause/resume',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      updateCommentsPage()
      return commentsPageVideoPlayer?.offsetParent && commentsPageVideo?.offsetParent
    } else {
      return activeVideoPlayer?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {

      if (commentsPageVideo!.readyState === 0) {
        const playButton = commentsPageVideoPlayer!.shadowRoot!.querySelector<HTMLElement>('vds-play-button icon-play')
        playButton?.click()
        commentsPageVideo!.addEventListener('canplay', () => void commentsPageVideo!.play(), { once: true })
        return
      }

      if (commentsPageVideo!.paused) void commentsPageVideo!.play()
      else commentsPageVideo!.pause()

    } else {
      if (activeVideo!.paused) void activeVideo!.play()
      else activeVideo!.pause()
    }
  }
})

category.shortcuts.set('videoRewind', {
  defaultKey: '[',
  description: 'Rewind',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      updateCommentsPage()
      return commentsPageVideoPlayer?.offsetParent && commentsPageVideo?.offsetParent
    } else {
      return activeVideoPlayer?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      commentsPageVideo!.fastSeek(commentsPageVideo!.currentTime - 5)
    } else {
      activeVideo!.fastSeek(activeVideo!.currentTime - 5)
    }
  }
})

category.shortcuts.set('videoForward', {
  defaultKey: ']',
  description: 'Fast forward',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      updateCommentsPage()
      return commentsPageVideoPlayer?.offsetParent && commentsPageVideo?.offsetParent
    } else {
      return activeVideoPlayer?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      commentsPageVideo!.fastSeek(commentsPageVideo!.currentTime + 5)
    } else {
      activeVideo!.fastSeek(activeVideo!.currentTime + 5)
    }
  }
})

// TODO add full screen shortcut
// 'f': {
//   description: 'Full screen',
//   event: () => {
//     if (!activeVideo) return
//   }
// },

category.shortcuts.set('videoMute', {
  defaultKey: 'm',
  description: 'Mute',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      updateCommentsPage()
      return commentsPageVideoPlayer?.offsetParent && commentsPageVideo?.offsetParent
    } else {
      return activeVideoPlayer?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      commentsPageVideo!.muted = !commentsPageVideo!.muted
    } else {
      activeVideo!.muted = !activeVideo!.muted
    }
  }
})

category.shortcuts.set('videoVolumeUp', {
  defaultKey: '+',
  description: 'Volume up',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      updateCommentsPage()
      return commentsPageVideoPlayer?.offsetParent && commentsPageVideo?.offsetParent
    } else {
      return activeVideoPlayer?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      commentsPageVideo!.volume = Math.max(0, Math.min(1, commentsPageVideo!.volume + 0.05))
    } else {
      activeVideo!.volume = Math.max(0, Math.min(1, activeVideo!.volume + 0.05))
    }
  }
})

category.shortcuts.set('videoVolumeDown', {
  defaultKey: '-',
  description: 'Volume down',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      updateCommentsPage()
      return commentsPageVideoPlayer?.offsetParent && commentsPageVideo?.offsetParent
    } else {
      return activeVideoPlayer?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      commentsPageVideo!.volume = Math.max(0, Math.min(1, commentsPageVideo!.volume - 0.05))
    } else {
      activeVideo!.volume = Math.max(0, Math.min(1, activeVideo!.volume - 0.05))
    }
  }
})

// TODO add show timeline shortcuts
// TODO add quality settings shortcuts

