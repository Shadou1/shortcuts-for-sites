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
  // TODO refactor :nth-of-type(2)
  const videosTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-of-type(2)')
  if (!videosTab?.offsetParent) return
  const autoplayVideo = document.querySelector('.html5-main-video')
  autoplayVideo?.pause?.()
  videosTab.click()

  whenTargetMutates('#content.ytd-app', focusFirstVideo)

  if (locationEndsWith('/videos')) observer?.disconnect()
}

export function navigateToPlaylists(mutations, observer) {
  // TODO refactor :nth-last-of-type(5), this will incorrectly select another tab when channel has a 'store' tab
  const playlistsTab = document.querySelector('#tabsContainer tp-yt-paper-tab:nth-last-of-type(5)')
  if (!playlistsTab?.offsetParent) return
  const autoplayVideo = document.querySelector('.html5-main-video')
  autoplayVideo?.pause?.()
  playlistsTab.click()

  whenTargetMutates('#content.ytd-app', focusFirstPlaylist)

  if (locationEndsWith('/playlists')) observer?.disconnect()
}

// FIXED? when navigating from channel video, first video is not focused (tab must be pressed for it to focus)
// may be because youtube switches anchors somehow when page is fully loaded
export function focusFirstVideo(mutations, observer) {
  if (!locationEndsWith('/videos', '/subscriptions', '/')) return

  let firstVideo
  if (locationEndsWith('/subscriptions')) {
    firstVideo = document.querySelector('ytd-browse[role="main"] #items ytd-grid-video-renderer #video-title')
  }
  else if (locationEndsWith('/videos', '/')) {
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

export function expandAndFocusFirstSubscription(mutations, observer) {
  const showMoreSubscriptionsAnchor = document.querySelector('#sections ytd-guide-section-renderer:nth-child(2) ytd-guide-collapsible-entry-renderer tp-yt-paper-item')
  if (!showMoreSubscriptionsAnchor) return
  showMoreSubscriptionsAnchor.click()

  // TODO using setTimeout is inconsistent, since if it takes more than 200ms to open guide bar it will not focus
  setTimeout(focusFirstSubscription, 200)
  // whenTargetMutates(focusFirstSubscription)

  observer.disconnect()
}

export function focusFirstSubscription(mutations, observer) {
  const firstChannelItem = document.querySelector('#sections ytd-guide-section-renderer:nth-child(2) tp-yt-paper-item')

  if (!firstChannelItem) return
  firstChannelItem.focus()

  observer?.disconnect()
}
