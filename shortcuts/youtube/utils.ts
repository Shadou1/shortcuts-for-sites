import { pathnameStartsWith, pathnameEndsWith } from '../../utils/locationUtils'

// Functions can be used as both callbacks for MutationObserver and as regular functions

// unused
export function goToHomeTab(mutations?: MutationRecord[], observer?: MutationObserver) {
  const homeTab = document.querySelector<HTMLElement>('#tabsContainer tp-yt-paper-tab:nth-of-type(1)')
  if (!homeTab?.offsetParent) return

  observer?.disconnect()

  setTimeout(() => homeTab.click(), 50)
}

export function goToVideosTab(mutations?: MutationRecord[], observer?: MutationObserver) {
  // TODO refactor :nth-of-type(2)
  const videosTab = document.querySelector<HTMLElement>('#tabsContainer tp-yt-paper-tab:nth-of-type(2)')
  if (!videosTab?.offsetParent) return

  // If channel has an autoplay video renderer, must wait for it to load or it will incorrectly play in the background
  const autoplayVideoRenderer = document.querySelector<HTMLElement>('#primary ytd-channel-video-player-renderer')
  if (autoplayVideoRenderer?.offsetParent) {
    const autoplayVideo = document.querySelector('ytd-player#player .html5-main-video')
    if (!autoplayVideo) return
  }

  observer?.disconnect()

  // TODO refactor if possible
  // clicking videosTabs right away won't work for some reason, but will work if autoplay video is loaded
  // probably because by the time autoplay video is loaded, video tab is set up and ready to be clicked
  // TODO it still sometimes plays video in background
  setTimeout(() => videosTab.click(), 150)
}

export function goToPlaylistsTab(mutations?: MutationRecord[], observer?: MutationObserver) {
  // TODO refactor :nth-last-of-type(5), this will incorrectly select another tab when channel has a 'store' tab
  const playlistsTab = document.querySelector<HTMLElement>('#tabsContainer tp-yt-paper-tab:nth-last-of-type(5)')
  if (!playlistsTab?.offsetParent) return

  // If channel has an autoplay video renderer, must wait for it to load or it will incorrectly play in the background
  const autoplayVideoRenderer = document.querySelector<HTMLElement>('#primary ytd-channel-video-player-renderer')
  if (autoplayVideoRenderer?.offsetParent) {
    const autoplayVideo = document.querySelector('ytd-player#player .html5-main-video')
    if (!autoplayVideo) return
  }

  observer?.disconnect()

  // TODO refactor if possible
  // TODO it still sometimes plays video in background
  setTimeout(() => playlistsTab.click(), 100)
}

// These are now obsolete since focus next/previous first/last video shortcuts are available
export function focusFirstVideo(mutations?: MutationRecord[], observer?: MutationObserver) {
  const firstVideo = document.querySelector<HTMLElement>('ytd-browse:not([hidden]) #contents #dismissible #meta a')
  if (!firstVideo) return

  observer?.disconnect()
  firstVideo.focus()
}

export function focusFirstVideoOn(endsWith?: string[], startsWith?: string[]) {
  return function (mutations?: MutationRecord[], observer?: MutationObserver) {
    if (endsWith && !pathnameEndsWith(...endsWith)) return
    if (startsWith && !pathnameStartsWith(...startsWith)) return

    const firstVideo = document.querySelector<HTMLElement>('ytd-browse[role="main"] #contents #dismissible #meta a')
    if (!firstVideo?.offsetParent) return

    observer?.disconnect()
    firstVideo.focus()
  }
}

export function focusFirstVideoOnQueryType(type: number) {
  return function (mutations?: MutationRecord[], observer?: MutationObserver) {
    let firstVideo: HTMLElement | null = null
    switch (type) {
      // When going from videos to home (or from home to videos(impossible)), first video will be focused on previous page
      case 1:
        // /videos, /
        firstVideo = document.querySelector('ytd-browse[role="main"] #content #video-title-link')
        break
      case 2:
        // /subscriptions
        firstVideo = document.querySelector('ytd-browse[role="main"] ytd-grid-renderer #items ytd-grid-video-renderer #video-title')
        break
      case 3:
        // /featured
        firstVideo = document.querySelector('ytd-browse[role="main"] yt-horizontal-list-renderer #items ytd-grid-video-renderer #video-title')
        break
    }

    if (!firstVideo) return

    observer?.disconnect()
    firstVideo.focus()
  }
}

export function focusFirstPlaylist(mutations?: MutationRecord[], observer?: MutationObserver) {
  if (!pathnameEndsWith('/playlists')) return

  const firstPlaylist = document.querySelector<HTMLElement>('ytd-browse[role="main"] ytd-item-section-renderer:first-of-type #items ytd-grid-playlist-renderer #video-title')
  if (!firstPlaylist) return

  observer?.disconnect()
  firstPlaylist.focus()
}

export function goToHome(mutations?: MutationRecord[], observer?: MutationObserver) {
  if (window.location.pathname === '/') return

  const homeAnchor = document.querySelector<HTMLElement>('#sections #endpoint[href="/"]')
  if (!homeAnchor) return

  observer?.disconnect()
  homeAnchor.click()
}

export function goToSubscriptions(mutations?: MutationRecord[], observer?: MutationObserver) {
  if (pathnameEndsWith('/subscriptions')) return

  const subscriptionsAnchor = document.querySelector<HTMLElement>('#sections #endpoint[href="/feed/subscriptions"]')
  if (!subscriptionsAnchor) return

  observer?.disconnect()
  subscriptionsAnchor.click()
}

export function focusFirstSubscription(mutations?: MutationRecord[], observer?: MutationObserver) {
  const firstChannelItem = document.querySelector<HTMLElement>('#sections ytd-guide-section-renderer:nth-child(2) tp-yt-paper-item')

  if (!firstChannelItem) return

  observer?.disconnect()
  firstChannelItem.focus()
}

export function expandAndFocusFirstSubscription(mutations?: MutationRecord[], observer?: MutationObserver) {
  const showMoreSubscriptionsAnchor = document.querySelector<HTMLElement>('#sections ytd-guide-section-renderer:nth-child(2) ytd-guide-collapsible-entry-renderer tp-yt-paper-item')
  if (!showMoreSubscriptionsAnchor) return

  observer?.disconnect()
  showMoreSubscriptionsAnchor.click()

  // TODO using setTimeout is inconsistent, since if it takes more than 200ms to open guide bar it will not focus
  setTimeout(focusFirstSubscription, 200)
  // whenElementMutatesQuery(focusFirstSubscription)
}
