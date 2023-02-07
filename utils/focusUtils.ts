export function getSetupUpdateIndexOnFocus(updateIndex: (index: number) => void) {
  let updateIndexAborts: AbortController[] = []

  // Account for focusable elements being null (means I overlooked it, like with reddit post being a poll and not having a post anchor)
  return function setupUpdateIndexOnFocus(elements: (HTMLElement | null)[]) {
    updateIndexAborts.forEach((abortController) => abortController.abort())
    updateIndexAborts = []

    elements.forEach((element, index) => {
      if (!element) return
      const abortController = new AbortController()
      element.addEventListener('focus', updateIndex.bind(null, index), { signal: abortController.signal })
      updateIndexAborts.push(abortController)
    })
  }
}
