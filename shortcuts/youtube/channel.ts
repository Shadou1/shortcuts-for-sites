import { openLinkInNewTab } from '../../utils/linkUtils'
import { pathnameEndsWith, pathnameStartsWith } from '../../utils/locationUtils'
import { whenElementMutatesQuery } from '../../utils/mutationUtils'
import { ShortcutsCategory } from '../Shortcuts'
import {
  goToPlaylistsTab,
  goToVideosTab
} from './utils'
import { videoAnchorIndex, videoAnchorsPanels } from './videos'

const category = new ShortcutsCategory('Channel and focused video', 'Channel')
export default category

let focusedVideoChannelAnchor: HTMLAnchorElement | null
function updateFocusedChannelAnchor() {
  const focusedVideoAnchorPanel = videoAnchorsPanels[videoAnchorIndex] as HTMLElement | undefined
  if (!focusedVideoAnchorPanel?.offsetParent) {
    focusedVideoChannelAnchor = null
    return false
  }
  focusedVideoChannelAnchor = focusedVideoAnchorPanel.querySelector('yt-formatted-string.ytd-channel-name a')
  // search result offsetParent might be null but it will be valid (invisible metadata)
  return focusedVideoChannelAnchor
}

function isGoToChannelShortcutsAvailable() {
  const isChannelAnchorValid = updateFocusedChannelAnchor()
  if (pathnameStartsWith('/watch', '/@', '/channel', '/c', '/user')) return true
  // NOTE this will cause a false positive if youtube uses #tabsContainer anywhere besides channel page
  if (document.querySelector('#tabsContainer')) return true
  if (isChannelAnchorValid) return true
}

category.shortcuts.set('goToChannelHome', {
  defaultKey: 'h',
  description: 'Go to channel home',
  isAvailable: isGoToChannelShortcutsAvailable,
  event: () => {
    if (pathnameStartsWith('/watch')) {
      const channelLink = document.querySelector<HTMLAnchorElement>('a.ytd-video-owner-renderer')!
      channelLink.click()

      // NOTE disable this for non /watch pages cause clicking on channel link on /watch page
      // goes to the channel but then goes back to the video of that channel
    } else if (focusedVideoChannelAnchor && !window.location.href.startsWith(focusedVideoChannelAnchor.href)) {
      focusedVideoChannelAnchor.click()

    } else if (!pathnameEndsWith('/featured')) {
      // if (!pathnameEndsWith('/videos', '/shorts', '/streams', '/playlists', '/community', '/channels', '/about'))
      const homeTab = document.querySelector<HTMLAnchorElement>('#tabsContainer tp-yt-paper-tab:nth-of-type(1)')!
      homeTab.click()
    }
  }
})

category.shortcuts.set('goToChannelVideos', {
  defaultKey: 'v',
  description: 'Go to channel videos',
  isAvailable: isGoToChannelShortcutsAvailable,
  event: () => {
    if (pathnameStartsWith('/watch')) {
      const channelLink = document.querySelector<HTMLAnchorElement>('a.ytd-video-owner-renderer')!
      channelLink.click()
      whenElementMutatesQuery('#content.ytd-app', goToVideosTab)

    } else if (focusedVideoChannelAnchor && !window.location.href.startsWith(focusedVideoChannelAnchor.href)) {
      focusedVideoChannelAnchor.click()
      whenElementMutatesQuery('#content.ytd-app', goToVideosTab)

    } else if (!pathnameEndsWith('/videos')) {
      // TODO refactor :nth-of-type(2)
      const videosTab = document.querySelector<HTMLElement>('#tabsContainer tp-yt-paper-tab:nth-of-type(2)')!
      videosTab.click()
    }
  }
})

category.shortcuts.set('goToChannelPlaylists', {
  defaultKey: 'p',
  description: 'Go to channel playlists',
  isAvailable: isGoToChannelShortcutsAvailable,
  event: () => {
    if (pathnameStartsWith('/watch')) {
      const channelLink = document.querySelector<HTMLElement>('a.ytd-video-owner-renderer')!
      channelLink.click()
      whenElementMutatesQuery('#content.ytd-app', goToPlaylistsTab)

    } else if (focusedVideoChannelAnchor && !window.location.href.startsWith(focusedVideoChannelAnchor.href)) {
      focusedVideoChannelAnchor.click()
      whenElementMutatesQuery('#content.ytd-app', goToPlaylistsTab)

    } else if (!pathnameEndsWith('/playlists')) {
      // TODO refactor :nth-last-of-type(5), this will incorrectly select another tab when channel has a 'store' tab, or doesn't have community tab
      const playlistsTab = document.querySelector<HTMLElement>('#tabsContainer tp-yt-paper-tab:nth-last-of-type(5)')!
      playlistsTab.click()
    }
  }
})

category.shortcuts.set('goToChannelNewTab', {
  defaultKey: 'H',
  description: 'Go to channel (new tab)',
  isAvailable: () => {
    const isChannelAnchorValid = updateFocusedChannelAnchor()
    if (pathnameStartsWith('/watch')) return true
    if (isChannelAnchorValid) return true
  },
  event: () => {
    if (pathnameStartsWith('/watch')) {
      const channelLink = document.querySelector<HTMLAnchorElement>('a.ytd-video-owner-renderer')!
      openLinkInNewTab(channelLink.href)
    } else {
      openLinkInNewTab(focusedVideoChannelAnchor!.href)
    }
  }
})

// TODO (is it possible?) add 'V' and 'P' shortcuts to go to channel videos and playlists in new tab
