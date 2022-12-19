/* eslint-disable no-useless-escape */
export const siteMatches = {
  'google-search': {
    hostnameMatch: /www\.google\..+/,
    path: 'shortcuts/google/search/shortcuts.js',
    hasNativeShortcuts: false,
  },
  'google-translate': {
    hostnameMatch: /translate\.google\..+/,
    path: 'shortcuts/google/translate/shortcuts.js',
    hasNativeShortcuts: false,
  },
  'youtube': {
    hostnameMatch: /www\.youtube\.com/,
    path: 'shortcuts/youtube/shortcuts.js',
    hasNativeShortcuts: true,
  },
  'twitch': {
    hostnameMatch: /www\.twitch\.tv/,
    path: 'shortcuts/twitch/shortcuts.js',
    hasNativeShortcuts: true,
  },
  'reddit': {
    hostnameMatch: /www\.reddit\.com/,
    path: 'shortcuts/reddit/shortcuts.js',
    hasNativeShortcuts: true,
  }
}
