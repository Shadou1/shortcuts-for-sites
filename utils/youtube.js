let locationEndsWith;
(async () => {
  ({ locationEndsWith } = await import(browser.runtime.getURL('utils/locationUtils.js')))
})()

let whenTargetMutates;
(async () => {
  ({ whenTargetMutates } = await import(browser.runtime.getURL('utils/mutationUtils.js')))
})()

// Functions can be used as both callbacks for MutationObserver and as regular functions

export function navigateToVideos(mutations, observer) {
  const videosTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-child(4)')
  if (!videosTab) return
  videosTab.click()

  whenTargetMutates('#content.ytd-app', focusFirstVideo)

  if (locationEndsWith('/videos')) observer?.disconnect()
}

export function navigateToPlaylists(mutations, observer) {
  const playlistsTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-child(6)')
  if (!playlistsTab) return
  playlistsTab.click()

  whenTargetMutates('#content.ytd-app', focusFirstPlaylist)

  if (locationEndsWith('/playlists')) observer?.disconnect()
}

export function focusFirstVideo(mutations, observer) {
  if (!locationEndsWith('/videos', '/subscriptions', '/')) return

  let firstVideo
  if (locationEndsWith('/videos', '/subscriptions')) {
    firstVideo = document.querySelector('ytd-browse[role="main"] #items ytd-grid-video-renderer #video-title')
  }
  else if (locationEndsWith('/')) {
    firstVideo = document.querySelector('ytd-browse[role="main"] #content #video-title-link')
  }
  if (!firstVideo) return
  firstVideo.focus()

  observer?.disconnect()
}

export function focusFirstPlaylist(mutations, observer) {
  if (!locationEndsWith('/playlists')) return

  const firstPlaylist = document.querySelector('ytd-browse[role="main"] #items ytd-grid-playlist-renderer #video-title')
  if (!firstPlaylist) return
  firstPlaylist.focus()

  observer?.disconnect()
  
}

export function goToHome(mutations, observer) {
  if (window.location.pathname === '/') return

  const homeAnchor = document.querySelector('#sections #endpoint[href="/"]')
  if (!homeAnchor) return
  homeAnchor.click()

  whenTargetMutates('#content.ytd-app', focusFirstVideo)
  
  observer?.disconnect()
}

export function goToSubscriptions(mutations, observer) {
  if (locationEndsWith('/subscriptions')) return
  
  const subscriptionsAnchor = document.querySelector('#sections #endpoint[href="/feed/subscriptions"]')
  if (!subscriptionsAnchor) return
  subscriptionsAnchor.click()

  whenTargetMutates('#content.ytd-app', focusFirstVideo)

  observer?.disconnect()
}

export function focusFirstSubscription(mutations, observer) {
  const showMoreSubscriptionsAnchor = document.querySelector('#sections ytd-guide-section-renderer:nth-child(2) ytd-guide-collapsible-entry-renderer tp-yt-paper-item')
  const firstChannelItem = document.querySelector('#sections ytd-guide-section-renderer:nth-child(2) tp-yt-paper-item')

  if (!showMoreSubscriptionsAnchor && !firstChannelItem) return
  showMoreSubscriptionsAnchor?.click()
  firstChannelItem.focus()

  observer?.disconnect()
}
