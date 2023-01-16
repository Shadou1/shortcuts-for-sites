import { ShortcutsCategory } from '../Shortcuts'
import { pathnameMatches } from '../../utils/locationUtils'
import {
  activeVideo,
  activeVideoInComments,
  activeVideoPlayer,
  activeVideoPlayerInComments,
  updateVideoInComments
} from './utilsActivePost'

const category = new ShortcutsCategory('Video', 'Video')
export default category

category.shortcuts.set('videoPauseResume', {
  defaultKey: ';',
  description: 'Pause/resume',
  isAvailable: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      return updateVideoInComments()
    } else {
      return activeVideoPlayer?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {

      if (activeVideoInComments!.readyState === 0) {
        const playButton = activeVideoPlayerInComments!.shadowRoot!.querySelector<HTMLElement>('vds-play-button icon-play')
        playButton?.click()
        activeVideoInComments!.addEventListener('canplay', () => void activeVideoInComments!.play(), { once: true })
        return
      }

      if (activeVideoInComments!.paused) void activeVideoInComments!.play()
      else activeVideoInComments!.pause()

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
      return updateVideoInComments()
    } else {
      return activeVideoPlayer?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      activeVideoInComments!.fastSeek(activeVideoInComments!.currentTime - 5)
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
      return updateVideoInComments()
    } else {
      return activeVideoPlayer?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      activeVideoInComments!.fastSeek(activeVideoInComments!.currentTime + 5)
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
      return updateVideoInComments()
    } else {
      return activeVideoPlayer?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      activeVideoInComments!.muted = !activeVideoInComments!.muted
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
      return updateVideoInComments()
    } else {
      return activeVideoPlayer?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      activeVideoInComments!.volume = Math.max(0, Math.min(1, activeVideoInComments!.volume + 0.05))
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
      return updateVideoInComments()
    } else {
      return activeVideoPlayer?.offsetParent
    }
  },
  event: () => {
    if (pathnameMatches(/^\/r\/.+?\/comments/)) {
      activeVideoInComments!.volume = Math.max(0, Math.min(1, activeVideoInComments!.volume - 0.05))
    } else {
      activeVideo!.volume = Math.max(0, Math.min(1, activeVideo!.volume - 0.05))
    }
  }
})

// TODO add show timeline shortcuts
// TODO add quality settings shortcuts

