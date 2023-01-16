import { pathnameStartsWith } from '../../utils/locationUtils'
import { whenElementMutatesQuery } from '../../utils/mutationUtils'
import {
  expandAndFocusFirstSubscription,
  focusFirstSubscription, goToHome,
  goToSubscriptions
} from './utils'
import { ShortcutsCategory } from '../Shortcuts'

const category = new ShortcutsCategory('Navigation', 'Navigation')
export default category

let subscriptionsAnchor: HTMLAnchorElement | null

let guideButton: HTMLButtonElement | null
category.shortcuts.set('expandGuideSidebar', {
  defaultKey: 'e',
  description: 'Expand/Collapse guide sidebar',
  event: () => {
    guideButton = guideButton ?? document.querySelector('ytd-masthead #guide-button #button')
    guideButton?.click()
    // guideButton?.focus()
  }
})

// TODO CRITICAL conflicts with native 'captions: rotate through opacity levels'
let homeAnchor: HTMLAnchorElement | null
category.shortcuts.set('goToHome', {
  defaultKey: 'o',
  description: 'Go to Home',
  event: () => {
    if (window.location.pathname === '/') return

    homeAnchor = homeAnchor ?? document.querySelector('#sections #endpoint[href="/"]')
    if (!homeAnchor) {
      guideButton = guideButton ?? document.querySelector('ytd-masthead #guide-button #button')
      if (!guideButton) return
      guideButton.click()
      whenElementMutatesQuery('#content.ytd-app', goToHome)
    } else {
      homeAnchor.click()
    }
  }
})

category.shortcuts.set('goToSubscriptions', {
  defaultKey: 'u',
  description: 'Go to Subscriptions',
  event: () => {
    if (pathnameStartsWith('/subscriptions')) return

    subscriptionsAnchor = subscriptionsAnchor ?? document.querySelector('#sections #endpoint[href="/feed/subscriptions"]')
    if (!subscriptionsAnchor) {
      guideButton = guideButton ?? document.querySelector('ytd-masthead #guide-button #button')
      if (!guideButton) return
      guideButton.click()
      whenElementMutatesQuery('#content.ytd-app', goToSubscriptions)
    } else {
      subscriptionsAnchor.click()
    }
  }
})

category.shortcuts.set('focusSubscribedChannels', {
  defaultKey: 'U',
  description: 'Focus subscribed channels',
  event: () => {
    guideButton = guideButton ?? document.querySelector('ytd-masthead #guide-button #button')
    if (guideButton?.getAttribute('aria-pressed') === 'false' || guideButton?.getAttribute('aria-pressed') === null) {
      guideButton.click()
      whenElementMutatesQuery('#content.ytd-app', expandAndFocusFirstSubscription)
    } else {
      focusFirstSubscription()
    }
  }
})
