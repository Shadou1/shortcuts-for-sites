export function getChangeIndex(elements: HTMLElement[], options: {
  skip?: (currentElement: HTMLElement) => boolean
} = {}) {

  return function changeIndex(to: 'next' | 'previous' | 'first' | 'last', currentIndex: number) {
    let newIndex = currentIndex
    switch (to) {
      case 'next':
        newIndex = Math.min(currentIndex + 1, elements.length - 1)
        while (options.skip?.(elements[newIndex]) && newIndex < elements.length - 1) newIndex++
        break
      case 'previous':
        newIndex = Math.max(currentIndex - 1, 0)
        while (options.skip?.(elements[newIndex]) && newIndex > 0) newIndex--
        break
      case 'first':
        newIndex = 0
        while (options.skip?.(elements[newIndex]) && newIndex < elements.length - 1) newIndex++
        break
      case 'last':
        newIndex = elements.length - 1
        while (options.skip?.(elements[newIndex]) && newIndex > 0) newIndex--
        break
    }
    if (options.skip?.(elements[newIndex])) newIndex = currentIndex
    return newIndex
  }
}
