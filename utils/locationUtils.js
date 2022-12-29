export function pathnameStartsWith(...prefixes) {
  for (const prefix of prefixes) {
    if (window.location.pathname.startsWith(prefix)) return true
  }
  return false
}

export function pathnameEndsWith(...postfixes) {
  for (const postfix of postfixes) {
    if (window.location.pathname.endsWith(postfix)) return true
  }
  return false
}

export function pathnameMatches(...matches) {
  for (const match of matches) {
    if (match.test(window.location.pathname)) return true
  }
  return false
}

export function didPathnameChange() {
  let previousPathname = null
  return function checkChange() {
    if (window.location.pathname !== previousPathname) {
      previousPathname = window.location.pathname
      return true
    }
    return false
  }
}

export function didHrefChange() {
  let previousHref = null
  return function checkChange() {
    if (window.location.href !== previousHref) {
      previousHref = window.location.href
      return true
    }
    return false
  }
}
