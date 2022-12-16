let pathnameStartsWith, pathnameEndsWith
import(browser.runtime.getURL('utils/locationUtils.js')).then((result) => {
  ({ pathnameStartsWith, pathnameEndsWith } = result)
})

let whenTargetMutates
import(browser.runtime.getURL('utils/mutationUtils.js')).then((result) => {
  ({ whenTargetMutates } = result)
})

export function focusFirstChannel(mutations, observer) {
  if (!pathnameStartsWith('/directory')) return

  const channelAnchor = document.querySelector('a[data-a-target="preview-card-channel-link"]')
  if (!channelAnchor) return

  observer?.disconnect()
  channelAnchor.focus()
}

export function focusFirstVideo(mutations, observer) {
  const firstVideo = document.querySelector(`:is(
[data-test-selector="preview-card-carousel-child-container"] a,
#offline-channel-main-content article a,
#front-page-main-content a[data-a-target="preview-card-channel-link"],
#following-page-main-content article a
)`)
  if (!firstVideo) return

  observer?.disconnect()
  firstVideo.focus()
}

export function focusFirstVideoOnQueryType(type) {
  return function (mutations, observer) {
    let firstVideo
    switch (type) {
      case 'channel video':
        firstVideo = document.querySelector('[data-test-selector="preview-card-carousel-child-container"] a')
        break
      case 'channel home':
        firstVideo = document.querySelector('#offline-channel-main-content article a')
        break
      case 'home':
        firstVideo = document.querySelector('#front-page-main-content a[data-a-target="preview-card-channel-link"]')
        break
      case 'following':
        firstVideo = document.querySelector('#following-page-main-content :is(.live-channel-card, [data-test-selector="shelf-card-selector"]) article a')
        break
      case 'browse':
        firstVideo = document.querySelector('#browse-root-main-content [data-target="directory-container"] a')
        break
    }

    if (!firstVideo) return

    observer?.disconnect()
    firstVideo.focus()

    return firstVideo
  }
}

export function focusFirstCategory(mutations, observer) {
  const categoryAnchor = document.querySelector('#browse-root-main-content [data-target="directory-first-item"] a[data-a-target="card-0"]')
  if (!categoryAnchor) return

  observer?.disconnect()
  categoryAnchor.focus()
  return categoryAnchor
}

export function navigateToLiveChannels(mutations, observer) {

  const liveChannelsAnchor = document.querySelector('a[data-a-target="browse-type-tab-live-channels"]')
  if (!liveChannelsAnchor) return

  observer?.disconnect()
  liveChannelsAnchor.click()

  // Sometimes it does not mutate and callback will execute wrongly
  const isFocused = focusFirstVideoOnQueryType('browse')()
  if (!isFocused) {
    whenTargetMutates('main', focusFirstVideoOnQueryType('browse'))
  }
}

export function navigateToVideos(mutations, observer) {
  const videosAnchor = document.querySelector('a[tabname="videos"]')
  if (!videosAnchor) return

  observer.disconnect()
  videosAnchor.click()

  whenTargetMutates('main', focusFirstVideo)
}

export function navigateToSchedule(mutations, observer) {
  const scheduleAnchor = document.querySelector('a[tabname="schedule"]')
  if (!scheduleAnchor) return

  observer.disconnect()
  scheduleAnchor.click()
  scheduleAnchor.focus()
}
