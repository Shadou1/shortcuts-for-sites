export interface Shortcut {
  defaultKey: string
  key?: string
  description: string
  ignoreInput?: boolean
  isAvailable?: () => unknown
  event: (event: Event) => void
  eventCtrl?: (event: Event) => void
  eventAlt?: (event: Event) => void
}

export class ShortcutsCategory {
  name: string
  description: string
  initialize?: () => void
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

// CROSS BROWSER SUPPORT
export type ShortcutCategoryJSONSerializable = Omit<ShortcutsCategory, 'shortcuts'> & {
  shortcuts: Record<string, Shortcut>
}

export type ShortcutsJSONSerializable = Omit<Shortcuts, 'categories'> & { categories: ShortcutCategoryJSONSerializable[] }
