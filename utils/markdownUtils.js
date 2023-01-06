import { siteMatches } from '../shortcuts/siteMatches.js'

export async function constructShortcutsReadmeMarkdown() {
  let markdown = ''

  for (const [site, { path }] of Object.entries(siteMatches)) {

    const siteName = site.replace(/^[a-z]|-[a-z]/g, (match) => match.replace('-', ' ').toUpperCase())
    markdown+=`
<details>
<summary>${siteName}</summary>

| Shortcut | Description |
| -------- | ----------- |\n`

    const { shortcuts } = await import(`../${path}`)
    let lastCategory = null
    for (const [_, { category, description, defaultKey }] of shortcuts) {
      if (category !== lastCategory) {
        lastCategory = category
        markdown += `| **${category}** |\n`
      }
      const verbatum = defaultKey.match(/^[A-Z]$/) ? ` (<kbd>Shift</kbd>+<kbd>${defaultKey.toLowerCase()}</kbd>)` : ''
      markdown += `| <kbd>${defaultKey !== '\\' ? defaultKey : '\\\\'}</kbd>${verbatum} | ${description} |\n`
    }
    markdown += '\n</details>\n\n<br>\n'

  }

  return markdown

}

// import(browser.runtime.getURL('utils/markdownUtils.js')).then(({ constructShortcutsReadmeMarkdown }) => {
//   constructShortcutsReadmeMarkdown().then((markdown) => {
//     console.log(markdown)
//   })
// })
