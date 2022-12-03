let locationEndsWith, locationStartsWith;
(async () => {
  ({ locationEndsWith, locationStartsWith } = await import(browser.runtime.getURL('utils/locationUtils.js')))
})()

let whenTargetMutates;
(async () => {
  ({ whenTargetMutates } = await import(browser.runtime.getURL('utils/mutationUtils.js')))
})()

// Functions can be used as both callbacks for MutationObserver and as regular functions

export function navigateToHome(mutations, observer) {
  const homeTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-of-type(1)')
  if (!homeTab?.offsetParent) return

  observer?.disconnect()

  setTimeout(() => homeTab.click(), 50)

  whenTargetMutates('#content.ytd-app', focusFirstVideoOnQueryType(3))
}

export function navigateToVideos(mutations, observer) {
  // TODO refactor :nth-of-type(2)
  const videosTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-of-type(2)')
  if (!videosTab?.offsetParent) return

  // If channel has an autoplay video renderer, must wait for it to load or it will incorrectly play in the background
  const autoplayVideoRenderer = document.querySelector('#primary ytd-channel-video-player-renderer')
  if (autoplayVideoRenderer?.offsetParent) {
    const autoplayVideo = document.querySelector('ytd-player#player .html5-main-video')
    if (!autoplayVideo) return
  }

  observer?.disconnect()

  // TODO refactor if possible
  // clicking videosTabs right away won't work for some reason, but will work if autoplay video is loaded
  // probably because by the time autoplay video is loaded, video tab is set up and ready to be clicked
  setTimeout(() => videosTab.click(), 50)

  whenTargetMutates('#content.ytd-app', focusFirstVideoOnQueryType(1))
}

export function navigateToPlaylists(mutations, observer) {
  // TODO refactor :nth-last-of-type(5), this will incorrectly select another tab when channel has a 'store' tab
  const playlistsTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-last-of-type(5)')
  if (!playlistsTab?.offsetParent) return
  
  // If channel has an autoplay video renderer, must wait for it to load or it will incorrectly play in the background
  const autoplayVideoRenderer = document.querySelector('#primary ytd-channel-video-player-renderer')
  if (autoplayVideoRenderer?.offsetParent) {
    const autoplayVideo = document.querySelector('ytd-player#player .html5-main-video')
    if (!autoplayVideo) return
  }

  observer?.disconnect()

  // TODO refactor if possible
  setTimeout(() => playlistsTab.click(), 50)

  whenTargetMutates('#content.ytd-app', focusFirstPlaylist)
}

export function focusFirstVideo(mutations, observer) {
  const firstVideo = document.querySelector('ytd-browse:not([hidden]) #contents #dismissible #meta a')
  if (!firstVideo) return

  observer?.disconnect()
  firstVideo.focus()
}

export function focusFirstVideoOn(endsWith, startsWith) {
  return function (mutations, observer) {
    if (endsWith && !locationEndsWith(...endsWith)) return
    if (startsWith && !locationStartsWith(...startsWith)) return

    const firstVideo = document.querySelector('ytd-browse[role="main"] #contents #dismissible #meta a')
    if (!firstVideo?.offsetParent) return

    observer?.disconnect()
    firstVideo.focus()
  }
}

export function focusFirstVideoOnQueryType(type) {
  return function (mutations, observer) {
    let firstVideo
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

export function focusFirstPlaylist(mutations, observer) {
  if (!locationEndsWith('/playlists')) return

  const firstPlaylist = document.querySelector('ytd-browse[role="main"] ytd-item-section-renderer:first-of-type #items ytd-grid-playlist-renderer #video-title')
  if (!firstPlaylist) return

  observer?.disconnect()
  firstPlaylist.focus()
}

export function goToHome(mutations, observer) {
  if (window.location.pathname === '/') return

  const homeAnchor = document.querySelector('#sections #endpoint[href="/"]')
  if (!homeAnchor) return

  observer?.disconnect()
  homeAnchor.click()

  whenTargetMutates('#content.ytd-app', focusFirstVideoOnQueryType(1))
}

export function goToSubscriptions(mutations, observer) {
  if (locationEndsWith('/subscriptions')) return
  
  const subscriptionsAnchor = document.querySelector('#sections #endpoint[href="/feed/subscriptions"]')
  if (!subscriptionsAnchor) return

  observer?.disconnect()
  subscriptionsAnchor.click()

  whenTargetMutates('#content.ytd-app', focusFirstVideoOnQueryType(2))
}

export function expandAndFocusFirstSubscription(mutations, observer) {
  const showMoreSubscriptionsAnchor = document.querySelector('#sections ytd-guide-section-renderer:nth-child(2) ytd-guide-collapsible-entry-renderer tp-yt-paper-item')
  if (!showMoreSubscriptionsAnchor) return

  observer.disconnect()
  showMoreSubscriptionsAnchor.click()

  // TODO using setTimeout is inconsistent, since if it takes more than 200ms to open guide bar it will not focus
  setTimeout(focusFirstSubscription, 200)
  // whenTargetMutates(focusFirstSubscription)
}

export function focusFirstSubscription(mutations, observer) {
  const firstChannelItem = document.querySelector('#sections ytd-guide-section-renderer:nth-child(2) tp-yt-paper-item')

  if (!firstChannelItem) return

  observer?.disconnect()
  firstChannelItem.focus()
}
