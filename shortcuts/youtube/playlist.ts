import { pathnameStartsWith } from '../../utils/locationUtils'
import { ShortcutsCategory } from '../Shortcuts'

const category = new ShortcutsCategory('Playlist', 'Playlist')
export default category

let firstPlaylistVideo: HTMLAnchorElement | null
category.shortcuts.set('focusFirstVideoInPlaylist', {
  defaultKey: ',',
  description: 'Focus first video in playlist',
  isAvailable: () => {
    if (!pathnameStartsWith('/watch')) return false
    firstPlaylistVideo = firstPlaylistVideo?.offsetParent ? firstPlaylistVideo : document.querySelector('#content ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer#playlist-items a')
    return firstPlaylistVideo?.offsetParent
  },
  event: () => {
    firstPlaylistVideo!.focus()
  }
})

let lastPlaylistVideo: HTMLAnchorElement | null
category.shortcuts.set('focusLastVideoInPlaylist', {
  defaultKey: '.',
  description: 'Focus last video in playlist',
  isAvailable: () => {
    if (!pathnameStartsWith('/watch')) return false
    lastPlaylistVideo = lastPlaylistVideo?.offsetParent ? lastPlaylistVideo : document.querySelector('#content ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer#playlist-items:last-of-type a')
    return lastPlaylistVideo?.offsetParent
  },
  event: () => {
    lastPlaylistVideo!.focus()
  }
})
