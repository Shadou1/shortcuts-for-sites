export function whenElementMutatesQuery(targetQuery: string, callback: MutationCallback, options: MutationObserverInit = { childList: true, subtree: true }) {
  const content = document.querySelector(targetQuery)
  if (!content) return
  const observer = new MutationObserver(callback)
  observer.observe(content, options)
  return observer
}

export function whenElementMutates(element: HTMLElement, callback: MutationCallback, options: MutationObserverInit = { childList: true, subtree: true }) {
  const observer = new MutationObserver(callback)
  observer.observe(element, options)
  return observer
}

export function findCommonParent(element1: HTMLElement, element2: HTMLElement) {
  // Find the lowest common ancestor
  const element1Parents = []
  let element1CurrentParent = element1.parentElement
  while (element1CurrentParent) {
    element1Parents.unshift(element1CurrentParent)
    element1CurrentParent = element1CurrentParent.parentElement
  }
  const element2Parents = []
  let element2CurrentParent = element2.parentElement
  while (element2CurrentParent) {
    element2Parents.unshift(element2CurrentParent)
    element2CurrentParent = element2CurrentParent.parentElement
  }

  let commonParent = element1Parents[0]
  for (let i = 1; i < element2Parents.length; i++) {
    if (element1Parents[i] !== element2Parents[i]) break
    commonParent = element2Parents[i]
  }
  return commonParent
}

export function getSetupMutations(
  getElements: () => HTMLElement[],
  options: {
    mutationWaitTimeMs?: number,
    mutationObserverOptions?: MutationObserverInit,
    /**
     * @returns whether the mutation observer callback should return before executing
     */
    beforeMutation?: (mutations: MutationRecord[], observer: MutationObserver) => boolean
    disconnectAfterMutation?: boolean
  } = {},
) {
  options.mutationWaitTimeMs = options.mutationWaitTimeMs ?? 200
  options.mutationObserverOptions = options.mutationObserverOptions ?? { childList: true }
  options.disconnectAfterMutation = options.disconnectAfterMutation ?? false

  let mutationObserver: MutationObserver | null
  let mutationTimeout: ReturnType<typeof setTimeout>

  function setupMutations(commonParent: HTMLElement) {
    mutationObserver?.disconnect()
    mutationObserver = whenElementMutates(commonParent, (mutations, observer) => {

      if (options.beforeMutation?.(mutations, observer)) return

      let didAddNodes = false
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          didAddNodes = true
          break
        }
      }
      if (!didAddNodes) return

      clearTimeout(mutationTimeout)
      mutationTimeout = setTimeout(() => {
        getElements()
        if (options.disconnectAfterMutation) observer.disconnect()
      }, options.mutationWaitTimeMs)

    }, options.mutationObserverOptions)
  }

  return setupMutations
}
