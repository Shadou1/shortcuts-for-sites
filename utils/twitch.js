let locationStartsWith, locationEndsWith;
(async () => {
  ({ locationStartsWith, locationEndsWith } = await import(browser.runtime.getURL('utils/locationUtils.js')))
})()

let whenTargetMutates;
(async () => {
  ({ whenTargetMutates } = await import(browser.runtime.getURL('utils/mutationUtils.js')))
})()

export function focusFirstChannel(mutations, observer) {
  if (!locationStartsWith('/directory')) return

  const channelAnchor = document.querySelector('a[data-a-target="preview-card-channel-link"]')
  if (!channelAnchor) return
  channelAnchor.focus()

  observer?.disconnect()
}

export function navigateToVideos(mutations, observer) {
  const videosAnchor = document.querySelector('a[tabname="videos"]')
  if (!videosAnchor) return
  videosAnchor.click()

  whenTargetMutates('main', focusFirstVideo)

  observer.disconnect()
}

export function focusFirstVideo(mutations, observer) {
  const firstVideo = document.querySelector('[data-test-selector="preview-card-carousel-child-container"] a')
  if (!firstVideo) return
  firstVideo.focus()

  observer?.disconnect()
}

export function navigateToSchedule(mutations, observer) {
  const scheduleAnchor = document.querySelector('a[tabname="schedule"]')
  if (!scheduleAnchor) return
  scheduleAnchor.click()
  scheduleAnchor.focus()

  observer.disconnect()
}
