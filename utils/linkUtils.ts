// NOTE user will need to open a new page for the setting to take effect (maybe it's ok?)
const settings = await browser.storage.sync.get('settings')
const openLinkInNewTabSetting = (settings['settings'] as Record<string, string> | undefined)?.['open-link-in-new-tab'] ?? 'with-anchor'

export function openLinkInNewTab(url: string) {
  switch (openLinkInNewTabSetting) {
    case 'with-anchor':
      // hack to preserve user's color scheme
      const tempAnchor = document.createElement('a')
      tempAnchor.setAttribute('target', '_blank')
      tempAnchor.href = url
      tempAnchor.click()
      break
    case 'with-window':
      window.open(url, '_blank')
      break
  }
}
