export function locationStartsWith(...prefixes) {
  for (const prefix of prefixes) {
    if (window.location.pathname.startsWith(prefix)) return true
  }
  return false
}

export function locationEndsWith(...postfixes) {
  for (const postfix of postfixes) {
    if (window.location.pathname.endsWith(postfix)) return true
  }
  return false
}

export function locationMatches(...matches) {
  for (const match of matches) {
    if (match.test(window.location.pathname)) return true
  }
  return false
}
