import { pathnameStartsWith } from '../../utils/locationUtils'

export function navigateToLiveChannels(mutations?: MutationRecord[], observer?: MutationObserver) {
  const liveChannelsAnchor = document.querySelector<HTMLElement>('a[data-a-target="browse-type-tab-live-channels"]')
  if (!liveChannelsAnchor) return

  observer?.disconnect()
  liveChannelsAnchor.click()
}

export function navigateToVideos(mutations?: MutationRecord[], observer?: MutationObserver) {
  const videosAnchor = document.querySelector<HTMLElement>('a[tabname="videos"]')
  if (!videosAnchor) return

  observer?.disconnect()
  videosAnchor.click()
}

export function navigateToSchedule(mutations?: MutationRecord[], observer?: MutationObserver) {
  const scheduleAnchor = document.querySelector<HTMLElement>('a[tabname="schedule"]')
  if (!scheduleAnchor) return

  observer?.disconnect()
  scheduleAnchor.click()
  scheduleAnchor.focus()
}

// These are now obsolete since focus next/previous first/last relevant shortcuts are available
export function focusFirstChannel(mutations?: MutationRecord[], observer?: MutationObserver) {
  if (!pathnameStartsWith('/directory')) return

  const channelAnchor = document.querySelector<HTMLElement>('a[data-a-target="preview-card-channel-link"]')
  if (!channelAnchor) return

  observer?.disconnect()
  channelAnchor.focus()
}

export function focusFirstVideo(mutations?: MutationRecord[], observer?: MutationObserver) {
  const firstVideo = document.querySelector<HTMLElement>(`:is(
[data-test-selector="preview-card-carousel-child-container"] a,
#offline-channel-main-content article a,
#front-page-main-content a[data-a-target="preview-card-channel-link"],
#following-page-main-content article a
)`)
  if (!firstVideo) return

  observer?.disconnect()
  firstVideo.focus()
}

export function focusFirstVideoOnQueryType(type: string) {
  return function (mutations?: MutationRecord[], observer?: MutationObserver) {
    let firstVideo: HTMLElement | null = null
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

export function focusFirstCategory(mutations?: MutationRecord[], observer?: MutationObserver) {
  const categoryAnchor = document.querySelector<HTMLElement>('#browse-root-main-content [data-target="directory-first-item"] a[data-a-target="card-0"]')
  if (!categoryAnchor) return

  observer?.disconnect()
  categoryAnchor.focus()
  return categoryAnchor
}
