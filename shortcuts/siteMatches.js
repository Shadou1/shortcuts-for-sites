/* eslint-disable no-useless-escape */
export const siteMatches = {
  'google-search': {
    hostnameMatch: /www\.google\..+/,
    path: 'google/search/shortcuts.js',
    hasNativeShortcuts: false,
  },
  'google-translate': {
    hostnameMatch: /translate\.google\..+/,
    path: 'google/translate/shortcuts.js',
    hasNativeShortcuts: false,
  },
  'youtube': {
    hostnameMatch: /www\.youtube\.com/,
    path: 'youtube/shortcuts.js',
    hasNativeShortcuts: true,
  },
  'twitch': {
    hostnameMatch: /www\.twitch\.tv/,
    path: 'twitch/shortcuts.js',
    hasNativeShortcuts: true,
  },
  'reddit': {
    hostnameMatch: /www\.reddit\.com/,
    path: 'reddit/shortcuts.js',
    hasNativeShortcuts: true,
  }
}
