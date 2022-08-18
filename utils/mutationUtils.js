export function whenTargetMutates(targetQuery, callback) {
  const content = document.querySelector(targetQuery)
  const observer = new MutationObserver(callback)
  observer.observe(content, { childList: true, subtree: true})
}