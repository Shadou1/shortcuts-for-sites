export interface Shortcut {
  defaultKey: string
  key?: string
  description: string
  isAvailable?: () => unknown
  event: () => void
  eventCtrl?: () => void
  eventAlt?: () => void
}

export class ShortcutsCategory {
  name: string
  description: string
  shortcuts = new Map<string, Shortcut>()
  constructor(name: string, description: string) {
    this.name = name
    this.description = description
  }
}

export default class Shortcuts {
  site: string
  siteHostnameMatch: RegExp
  siteHasNativeShortcuts: boolean
  categories: ShortcutsCategory[] = []
  constructor(site: string, siteHostnameMatch: RegExp, siteHasNativeShortcuts: boolean, categories: ShortcutsCategory[]) {
    this.site = site
    this.siteHostnameMatch = siteHostnameMatch
    this.siteHasNativeShortcuts = siteHasNativeShortcuts
    this.categories = categories
  }
}