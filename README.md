# Shortcuts For Sites

WebExtension that adds keyboard shortcuts for easier navigation on popular websites.

## Description

Navigating websites without touching your mouse can be difficult. Focusing links and other text elements is easy enough with *quick find* and *quick find within link-text only* (<kbd>/</kbd> and <kbd>'</kbd> shortcuts in firefox), but for everything else pressing <kbd>Tab</kbd> every time can become a chore. With this in mind, I implemented a number of shortcuts for different websites which should make navigating them with a keyboard more comfortable.

## Useful tips

- Pressing <kbd>Alt</kbd>+<kbd>k</kbd> will display shortcuts for the current website.
- Press <kbd>Tab</kbd> once to force browser to draw focus outline.
- On some websites, pressing <kbd>?</kbd> will display already available shortcuts.

## Popup

![Popup preview](https://user-images.githubusercontent.com/33831256/204445402-21559bcb-7879-4de0-a006-10e476159da7.png)

## Demonstration

https://youtu.be/9MR6KKRwTP0

## Issues

- Focus outline won't render on some pages if the user hasn't pressed <kbd>Tab</kbd> at least once while on a page.
- On Twitch, <kbd>d</kbd> shortcut to scroll to stream description will work incorrectly the first time.
- Shortcuts are not rebindable right now.

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
| **Channel (works on channel or video page)** |
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
