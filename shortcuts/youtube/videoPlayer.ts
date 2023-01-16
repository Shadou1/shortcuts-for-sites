import { pathnameStartsWith } from '../../utils/locationUtils'
import { whenElementMutatesQuery } from '../../utils/mutationUtils'
import { ShortcutsCategory } from '../Shortcuts'

const category = new ShortcutsCategory('Video Player', 'Video Player')
export default category

let moviePlayer: HTMLElement | null // consistent
let settingsButton: HTMLButtonElement | null

let moviePlayerChannel: HTMLElement | null // constistent
let settingsButtonChannel: HTMLButtonElement | null

category.shortcuts.set('openVideoSettings', {
  defaultKey: 's',
  description: 'Open settings',
  isAvailable: () => {
    if (pathnameStartsWith('/watch')) return true
    else if (pathnameStartsWith('/@', '/channel', '/c', '/user')) {
      moviePlayerChannel = moviePlayerChannel ?? document.querySelector('#c4-player')
      return moviePlayerChannel?.offsetParent
    }
  },
  event: () => {
    if (pathnameStartsWith('/watch')) {
      settingsButton = settingsButton ?? document.querySelector('#movie_player .ytp-settings-button')
      settingsButton?.click()
    }
    else if (pathnameStartsWith('/@', '/channel', '/c', '/user')) {
      settingsButtonChannel = settingsButtonChannel ?? document.querySelector('#c4-player .ytp-settings-button')
      settingsButtonChannel?.click()
    }
  }
})

let qualityButton: HTMLButtonElement | null
let qualityButtonChannel: HTMLButtonElement | null
category.shortcuts.set('openVideoQualitySettings', {
  defaultKey: 'q',
  description: 'Open quality settings',
  isAvailable: () => {
    if (pathnameStartsWith('/watch')) return true
    else if (pathnameStartsWith('/@', '/channel', '/c', '/user')) {
      moviePlayerChannel = moviePlayerChannel ?? document.querySelector('#c4-player')
      return moviePlayerChannel?.offsetParent
    }
  },
  event: () => {
    if (pathnameStartsWith('/watch')) {
      settingsButton = settingsButton ?? document.querySelector('#movie_player .ytp-settings-button')!
      if (settingsButton.getAttribute('aria-expanded') === 'false') {
        settingsButton.click()
        qualityButton = qualityButton ?? document.querySelector('#movie_player .ytp-panel-menu .ytp-menuitem:last-child')!
        qualityButton.click()
      } else {
        settingsButton.click()
      }
    }
    else if (pathnameStartsWith('/@', '/channel', '/c', '/user')) {
      settingsButtonChannel = settingsButtonChannel ?? document.querySelector('#c4-player .ytp-settings-button')!
      if (settingsButtonChannel.getAttribute('aria-expanded') === 'false') {
        settingsButtonChannel.click()
        qualityButtonChannel = qualityButtonChannel ?? document.querySelector('#c4-player .ytp-panel-menu .ytp-menuitem:last-child')!
        qualityButtonChannel.click()
      } else {
        settingsButtonChannel.click()
      }
    }
  }
})

category.shortcuts.set('focusVideoPlayer', {
  defaultKey: ';',
  description: 'Focus video player / show progress bar',
  isAvailable: () => {
    if (pathnameStartsWith('/watch')) return true
    else if (pathnameStartsWith('/@', '/channel', '/c', '/user')) {
      moviePlayerChannel = moviePlayerChannel ?? document.querySelector('#c4-player')
      return moviePlayerChannel?.offsetParent
    }
  },
  event: () => {
    if (pathnameStartsWith('/watch')) {
      moviePlayer = moviePlayer ?? document.querySelector('#movie_player')!
      // TODO refactor
      moviePlayer.focus()
      moviePlayer.click()
      moviePlayer.click()
    }
    else if (pathnameStartsWith('/@', '/channel', '/c', '/user')) {
      moviePlayerChannel = moviePlayerChannel ?? document.querySelector('#c4-player')!
      // TODO refactor
      moviePlayerChannel.focus()
      moviePlayerChannel.click()
      moviePlayerChannel.click()
    }
  }
})

let descriptionExpanded = false
category.shortcuts.set('scrollToVideoDescription', {
  defaultKey: 'd',
  description: 'Scroll to description/video',
  isAvailable: () => pathnameStartsWith('/watch'),
  event: () => {
    // TODO when clicking to fast, it stops working
    const infoRenderer = document.querySelector('#info ytd-video-primary-info-renderer, #above-the-fold')!
    const showMoreButton = document.querySelector<HTMLButtonElement>('.ytd-video-secondary-info-renderer tp-yt-paper-button#more, tp-yt-paper-button#expand')
    const showLessButton = document.querySelector<HTMLButtonElement>('.ytd-video-secondary-info-renderer tp-yt-paper-button#less, tp-yt-paper-button#collapse')
    if (!descriptionExpanded) {
      infoRenderer.scrollIntoView()
      showMoreButton?.focus()
      showMoreButton?.click()
    } else {
      moviePlayer = moviePlayer ?? document.querySelector('#movie_player')!
      showLessButton?.click()
      moviePlayer.focus()
      // window.scrollTo({ top: 0 })
    }
    descriptionExpanded = !descriptionExpanded
  }
})

category.shortcuts.set('focusCommentBox', {
  defaultKey: 'n',
  description: 'Comment',
  isAvailable: () => pathnameStartsWith('/watch'),
  event: () => {
    let commentBox = document.querySelector<HTMLElement>('ytd-comment-simplebox-renderer #placeholder-area')
    if (!commentBox) {

      const infoRenderer = document.querySelector('#info ytd-video-primary-info-renderer, #above-the-fold')!
      infoRenderer.scrollIntoView()
      whenElementMutatesQuery('#content.ytd-app', (mutations, observer) => {
        commentBox = document.querySelector<HTMLElement>('ytd-comment-simplebox-renderer #placeholder-area')
        if (!commentBox) return

        observer.disconnect()
        commentBox.click()
      })

    } else {
      commentBox.click()
    }
  }
})
