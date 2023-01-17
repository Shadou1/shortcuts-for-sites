import { pathnameEndsWith } from '../../utils/locationUtils'
import { whenElementMutatesQuery } from '../../utils/mutationUtils'
import { navigateToSchedule, navigateToVideos } from './utils'
import { ShortcutsCategory } from '../Shortcuts'

const category = new ShortcutsCategory('Channel', 'Channel')
export default category

let channelAnchor: HTMLAnchorElement | null
category.shortcuts.set('goToOfflineChannel', {
  defaultKey: 'h',
  description: 'Go to online/offline channel sections',
  isAvailable: () => {
    channelAnchor = document.querySelector('#live-channel-stream-information a:not([href^="/directory"], [data-a-target="stream-game-link"]), #offline-channel-main-content a')
    return channelAnchor?.offsetParent
  },
  event: () => {
    channelAnchor!.click()
  }
})

let videosAnchor: HTMLAnchorElement | null
category.shortcuts.set('goToChannelVideos', {
  defaultKey: 'v',
  description: 'Go to channel videos',
  isAvailable: () => {
    videosAnchor = document.querySelector('a[tabname="videos"]')
    if (videosAnchor?.offsetParent) return true
    channelAnchor = document.querySelector('#live-channel-stream-information a:not([href^="/directory"], .tw-link, [data-test-selector="clips-watch-full-button"]), #offline-channel-main-content a')
    return channelAnchor?.offsetParent
  },
  event: () => {
    if (videosAnchor) {
      if (pathnameEndsWith('/videos') && !window.location.search) return
      videosAnchor.click()
    } else {
      channelAnchor!.click()
      whenElementMutatesQuery('main', navigateToVideos)
    }
  }
})

let scheduleAnchor: HTMLAnchorElement | null
category.shortcuts.set('goToChannelSchedule', {
  defaultKey: 'S',
  description: 'Go to channel schedule',
  isAvailable: () => {
    scheduleAnchor = document.querySelector('a[tabname="schedule"]')
    if (scheduleAnchor?.offsetParent) return true
    channelAnchor = document.querySelector('#live-channel-stream-information a:not([href^="/directory"]):not(.tw-link):not([data-test-selector="clips-watch-full-button"]), #offline-channel-main-content a')
    return channelAnchor?.offsetParent
  },
  event: () => {
    if (scheduleAnchor) {
      if (pathnameEndsWith('/schedule')) {
        scheduleAnchor.focus()
      } else {
        scheduleAnchor.click()
        scheduleAnchor.focus()
      }
    } else {
      channelAnchor!.click()
      whenElementMutatesQuery('main', navigateToSchedule)
    }
  }
})
