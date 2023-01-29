export function getSetupUpdateIndexOnFocus(updateIndex: (index: number) => void) {
  let updateIndexAborts: AbortController[] = []

  return function setupUpdateIndexOnFocus(elements: HTMLElement[]) {
    updateIndexAborts.forEach((abortController) => abortController.abort())
    updateIndexAborts = []

    elements.forEach((element, index) => {
      const abortController = new AbortController()
      element.addEventListener('focus', updateIndex.bind(null, index), { signal: abortController.signal })
      updateIndexAborts.push(abortController)
    })
  }
}
