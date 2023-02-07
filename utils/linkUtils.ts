// NOTE user will need to open a new page for the setting to take effect (maybe it's ok?)
const settings = await browser.storage.sync.get('settings')
const openLinkInNewTabSetting = (settings['settings'] as Record<string, string> | undefined)?.['open-link-in-new-tab'] ?? 'with-anchor'

export function openLinkInNewTab(url: string) {
  switch (openLinkInNewTabSetting) {
    case 'with-anchor':
      // preserves color scheme, unlike window.open(url, '_blank')
      const tempAnchor = document.createElement('a')
      tempAnchor.rel = 'noreferrer'
      tempAnchor.target = '_blank'
      tempAnchor.href = url
      tempAnchor.click()
      break
    case 'with-window':
      // looks like 'rel=noreferrer' makes window.open() preserve user's color scheme
      window.open(url, '_blank', 'noreferrer')
      break
  }
}

export function openLinkInThisTab(url: string) {
  switch (openLinkInNewTabSetting) {
    case 'with-anchor':
      const tempAnchor = document.createElement('a')
      tempAnchor.rel = 'noreferrer'
      tempAnchor.href = url
      tempAnchor.click()
      break
    case 'with-window':
      window.open(url, '_self', 'noreferrer')
      break
  }
}
