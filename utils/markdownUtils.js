export function constructShortcutsMarkdown(shortcuts) {

  let markdown = '| Shortcut | Description |\n| -------- | ----------- |\n'
  let lastCategory = null
  for (const [shortcut, { category, description, verbatum }] of Object.entries(shortcuts)) {
    if (category !== lastCategory) {
      lastCategory = category
      markdown += `| **${category}** |\n`
    }
    // Amazing
    markdown += `| <kbd>${shortcut}</kbd> ${verbatum ? `(${verbatum.replace(/[^+]+/g, (substring) => `<kbd>${substring}</kbd>`)})` : ''}| ${description} |\n`
  }

  return markdown

}

// let constructShortcutsMarkdown;
// (async () => {
//   ({ constructShortcutsMarkdown } = await import(browser.runtime.getURL('utils/markdownUtils.js')))
// })()

// console.log(constructShortcutsMarkdown(keyboardOnlyNavigation.shortcuts))
