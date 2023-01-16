import allShortcuts from '../shortcuts/allShortcuts'

export function constructShortcutsReadmeMarkdown() {
  let markdown = ''

  for (const shortcuts of allShortcuts) {

    const siteName = shortcuts.site.replace(/^[a-z]|-[a-z]/g, (match) => match.replace('-', ' ').toUpperCase())
    markdown+=`
<details>
<summary>${siteName}</summary>

| Shortcut | Description |
| -------- | ----------- |\n`

    for (const category of shortcuts.categories) {
      markdown += `| **${category.name}** |\n`
      for (const shortcut of category.shortcuts.values()) {
        const verbatum = shortcut.defaultKey.match(/^[A-Z]$/) ? ` (<kbd>Shift</kbd>+<kbd>${shortcut.defaultKey.toLowerCase()}</kbd>)` : ''
        markdown += `| <kbd>${shortcut.defaultKey !== '\\' ? shortcut.defaultKey : '\\\\'}</kbd>${verbatum} | ${shortcut.description} |\n`
      }
    }

    markdown += '\n</details>\n\n<br>\n'
  }

  return markdown
}

// import { constructShortcutsReadmeMarkdown } from ''
// const markdown = constructShortcutsReadmeMarkdown()
// console.log(markdown)
