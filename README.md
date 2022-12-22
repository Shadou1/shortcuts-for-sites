# Shortcuts For Sites

WebExtension that adds keyboard shortcuts for easier navigation on popular websites.

## Description

Navigating websites without touching your mouse can be difficult. Although there are features like `find`, `quick find`, and `quick find within link-text only` (<kbd>Ctrl</kbd>+<kbd>f</kbd>, <kbd>/</kbd>, and <kbd>'</kbd> shortcuts in firefox) which can be used to focus needed elements, sometimes using <kbd>Tab</kbd> is unavoidable. Moreover, typing out search strings every time can become old. With this in mind, I implemented a number of shortcuts for different websites which should make navigating them with a keyboard more comfortable.

## Useful tips

- Pressing <kbd>Alt</kbd>+<kbd>k</kbd> will display shortcuts for the current website.
- $\textcolor{green}{\text{Green outline}}$ means that the shortcut is usable right now.
- On some websites, pressing <kbd>?</kbd> will display already available shortcuts.
- You can rebind shortcuts on extension's *options page* (preferences page).
- Press <kbd>Tab</kbd> once to force browser to draw focus outline.
- On Reddit, without logging in shortcuts will work poorly. Also native <kbd>j</kbd>/<kbd>k</kbd> shortcuts will sometimes stop working, pressing <kbd>Tab</kbd> or reloading the page will usually get them working again.

## Popup

![Popup preview](https://user-images.githubusercontent.com/33831256/204445402-21559bcb-7879-4de0-a006-10e476159da7.png)

## Demonstration

https://youtu.be/9MR6KKRwTP0

## How it works

Extension loads [content script](/content-scripts/init.js) into sites that it has shortcuts for (defined in [manifest.json](manifest.json)). Content script listens for [keydown](/content-scripts/init.js#L88) events and executes corresponding [shortcut](shortcuts/) events. Shortcut events define what should happen when the user presses the shortcut's key. These events do a wide range of things, focusing and clicking elements, going to next/previous elements, opening menus (settings menus), navigating to different site sections, controlling video players, and other. Sometimes there are functionality besides shourtcut events for the site, like scrolling a page when an element is focused.

> __Note__
>
> Because sites can update their structure, be it html or javascript, shortcuts might break or stop working. If they did break, it means that I haven't updated the extension yet. Submit a new issue if shortcuts have been broken for some time.

## Issues

- Focus outline won't render on some pages if the user hasn't pressed <kbd>Tab</kbd> at least once while on a page.
- On Twitch, <kbd>d</kbd> shortcut to scroll to stream description will work incorrectly the first time.
- On Youtube, going to channel videos/playlists from */watch* will sometimes play channel's autoplay video in background.
- On Reddit, shortcuts work poorly without logging in.

## Full list of available shortcuts

<details>
<summary>Google Search</summary>

| Shortcut | Description |
| -------- | ----------- |
| **Navigation** |
| <kbd>a</kbd> | Go to all search results |
| <kbd>i</kbd> | Go to images |
| <kbd>v</kbd> | Go to videos |
| <kbd>n</kbd> | Go to news |
| **Search** |
| <kbd>j</kbd> | Focus next search result / image |
| <kbd>k</kbd> | Focus previous search result / image |
| <kbd>J</kbd> (<kbd>Shift</kbd>+<kbd>j</kbd>) | Go to next search page |
| <kbd>K</kbd> (<kbd>Shift</kbd>+<kbd>k</kbd>) | Go to previous search page |
| <kbd>o</kbd> | Focus next related search |

</details>

<br>

<details>
<summary>Google Translate</summary>

| Shortcut | Description |
| -------- | ----------- |
| **General** |
| <kbd>j</kbd> | Focus translate-from box |
| <kbd>d</kbd> | Show/hide definitions |
| <kbd>e</kbd> | Show/hide examples |
| <kbd>t</kbd> | Show/hide translations |

</details>

<br>

<details>
<summary>Youtube</summary>

| Shortcut | Description |
| -------- | ----------- |
| **General** |
| <kbd>e</kbd> | Expand/Collapse guide sidebar |
| <kbd>o</kbd> | Go to Home |
| <kbd>u</kbd> | Go to Subscriptions |
| <kbd>U</kbd> (<kbd>Shift</kbd>+<kbd>u</kbd>) | Focus subscribed channels |
| **Video** |
| <kbd>s</kbd> | Open settings |
| <kbd>q</kbd> | Open quality settings |
| <kbd>;</kbd> | Focus video / show progress bar |
| <kbd>d</kbd> | Scroll to description/video |
| <kbd>r</kbd> | Focus first related video |
| <kbd>n</kbd> | Comment |
| **Playlist** |
| <kbd>[</kbd> | Focus first video in playlist |
| <kbd>]</kbd> | Focus last video in playlist |
| **Channel** |
| <kbd>h</kbd> | Go to channel home |
| <kbd>v</kbd> | Go to channel videos |
| <kbd>p</kbd> | Go to channel playlists |
| <kbd>H</kbd> (<kbd>Shift</kbd>+<kbd>h</kbd>) | Go to channel (new tab) |
| **Premiere/Stream** |
| <kbd>E</kbd> (<kbd>Shift</kbd>+<kbd>e</kbd>) | Hide/Show chat |
| <kbd>b</kbd> | Chat |
| <kbd>S</kbd> (<kbd>Shift</kbd>+<kbd>s</kbd>) | Skip ahead to live broadcast |

</details>

<br>

<details>
<summary>Twitch</summary>

| Shortcut | Description |
| -------- | ----------- |
| **General** |
| <kbd>E</kbd> (<kbd>Shift</kbd>+<kbd>e</kbd>) | Expand/collapse left sidebar |
| <kbd>u</kbd> | Focus followed channels |
| <kbd>r</kbd> | Focus recommended channels |
| <kbd>o</kbd> | Go to home |
| <kbd>U</kbd> (<kbd>Shift</kbd>+<kbd>u</kbd>) | Go to following |
| <kbd>b</kbd> | Browse categories |
| <kbd>B</kbd> (<kbd>Shift</kbd>+<kbd>b</kbd>) | Browse live channels |
| **Stream** |
| <kbd>s</kbd> | Open settings |
| <kbd>q</kbd> | Open quality settings |
| <kbd>C</kbd> (<kbd>Shift</kbd>+<kbd>c</kbd>) | Go to stream category |
| <kbd>d</kbd> | Scroll to description/video |
| **Chat** |
| <kbd>c</kbd> | Chat |
| <kbd>e</kbd> | Expand/collapse chat |
| **Channel** |
| <kbd>h</kbd> | Go to online/offline channel sections |
| <kbd>v</kbd> | Go to channel videos |
| <kbd>S</kbd> (<kbd>Shift</kbd>+<kbd>s</kbd>) | Go to channel schedule |
| **Mini player** |
| <kbd>x</kbd> | Expand mini player |
| <kbd>X</kbd> (<kbd>Shift</kbd>+<kbd>x</kbd>) | Close mini player |

</details>

<br>

<details>
<summary>Reddit</summary>

| Shortcut | Description |
| -------- | ----------- |
| **General** |
| <kbd>o</kbd> | Go to home |
| <kbd>u</kbd> | Go to popular |
| **Post** |
| <kbd>i</kbd> | Go to post's subreddit |
| <kbd>I</kbd> (<kbd>Shift</kbd>+<kbd>i</kbd>) | Go to post's subreddit (new tab) |
| **Posts filters** |
| <kbd>1</kbd> | Hot posts |
| <kbd>2</kbd> | New posts |
| <kbd>3</kbd> | Top posts |
| <kbd>4</kbd> | Rising posts |
| <kbd>t</kbd> | Choose time period |
| **Video** |
| <kbd>;</kbd> | Pause/resume |
| <kbd>[</kbd> | Rewind |
| <kbd>]</kbd> | Fast forward |
| <kbd>m</kbd> | Mute |
| <kbd>+</kbd> | Volume up |
| <kbd>-</kbd> | Volume down |

</details>
