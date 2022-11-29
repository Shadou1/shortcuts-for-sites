export function constructHotkeysMarkdown(hotkeys) {

  let markdown = '| Hotkey | Description |\n| ------ | ----------- |\n'
  let lastCategory = null
  for (const [hotkey, { category, description, verbatum }] of Object.entries(hotkeys)) {
    if (category !== lastCategory) {
      lastCategory = category
      markdown += `| **${category}** |\n`
    }
    // Amazing
    markdown += `| <kbd>${hotkey}</kbd> ${verbatum ? `(${verbatum.replace(/[^+]+/g, (substring) => `<kbd>${substring}</kbd>`)})` : ''} | ${description} |\n`
  }

  return markdown

}

// let constructHotkeysMarkdown;
// (async () => {
//   ({ constructHotkeysMarkdown } = await import(browser.runtime.getURL('utils/markdownUtils.js')))
// })()

// console.log(constructHotkeysMarkdown(keyboardOnlyNavigation.hotkeys))
