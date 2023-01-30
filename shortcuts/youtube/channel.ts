import { pathnameEndsWith, pathnameStartsWith } from '../../utils/locationUtils'
import { whenElementMutatesQuery } from '../../utils/mutationUtils'
import {
  goToPlaylistsTab,
  goToVideosTab
} from './utils'
import { ShortcutsCategory } from '../Shortcuts'

const category = new ShortcutsCategory('Channel', 'Channel')
export default category

category.shortcuts.set('goToChannelHome', {
  defaultKey: 'h',
  description: 'Go to channel home',
  isAvailable: () => {
    if (pathnameStartsWith('/watch', '/@', '/channel', '/c', '/user')) return true
    // NOTE this will cause a false positive if youtube uses #tabsContainer anywhere besides channel page
    if (document.querySelector('#tabsContainer')) return true
  },
  event: () => {
    if (pathnameStartsWith('/watch')) {
      const channelLink = document.querySelector<HTMLAnchorElement>('a.ytd-video-owner-renderer')!
      channelLink.click()
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
  isAvailable: () => {
    if (pathnameStartsWith('/watch', '/@', '/channel', '/c', '/user')) return true
    if (document.querySelector('#tabsContainer')) return true
  },
  event: () => {
    if (pathnameStartsWith('/watch')) {
      const channelLink = document.querySelector<HTMLAnchorElement>('a.ytd-video-owner-renderer')!
      channelLink.click()
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
  isAvailable: () => {
    if (pathnameStartsWith('/watch', '/@', '/channel', '/c', '/user')) return true
    if (document.querySelector('#tabsContainer')) return true
  },
  event: () => {
    if (pathnameStartsWith('/watch')) {
      const channelLink = document.querySelector<HTMLElement>('a.ytd-video-owner-renderer')!
      channelLink.click()
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
  isAvailable: () => pathnameStartsWith('/watch'),
  event: () => {
    const channelLink = document.querySelector<HTMLAnchorElement>('a.ytd-video-owner-renderer')!

    // hack to preserve user's color scheme
    const tempAnchor = document.createElement('a')
    tempAnchor.setAttribute('target', '_blank')
    tempAnchor.href = channelLink.href
    tempAnchor.click()
  }
})
