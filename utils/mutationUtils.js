export function whenElementMutatesQuery(targetQuery, callback, options = { childList: true, subtree: true }) {
  const content = document.querySelector(targetQuery)
  const observer = new MutationObserver(callback)
  observer.observe(content, options)
}

export function whenElementMutates(element, callback, options = { childList: true, subtree: true }) {
  const observer = new MutationObserver(callback)
  observer.observe(element, options)
}
