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
<summary>Google search</summary>

| Shortcut | Description |
| -------- | ----------- |
| **Navigation** |
| <kbd>a</kbd>  | Go to all search results |
| <kbd>i</kbd>  | Go to images |
| <kbd>v</kbd>  | Go to videos |
| <kbd>n</kbd>  | Go to news |
| **Search** |
| <kbd>l</kbd>  | Focus next search result |
| <kbd>j</kbd>  | Focus previous search result |
| <kbd>L</kbd> (<kbd>Shift</kbd>+<kbd>l</kbd>) | Go to next search page |
| <kbd>J</kbd> (<kbd>Shift</kbd>+<kbd>j</kbd>) | Go to previous search page |
| <kbd>o</kbd>  | Focus next related search |

</details>

<br>

<details>
<summary>Google translate</summary>

| Shortcut | Description |
| -------- | ----------- |
| **General** |
| <kbd>j</kbd>  | Focus translate-from box |
| <kbd>d</kbd>  | Show/hide definitions |
| <kbd>e</kbd>  | Show/hide examples |
| <kbd>t</kbd>  | Show/hide translations |

</details>

<br>

<details>
<summary>Youtube</summary>

| Shortcut | Description |
| -------- | ----------- |
| **General** |
| <kbd>e</kbd>  | Expand/Collapse guide sidebar |
| <kbd>o</kbd>  | Go to Home |
| <kbd>u</kbd>  | Go to Subscriptions |
| <kbd>U</kbd> (<kbd>Shift</kbd>+<kbd>u</kbd>) | Focus subscribed channels |
| **Video** |
| <kbd>s</kbd>  | Open settings |
| <kbd>q</kbd>  | Open quality settings |
| <kbd>;</kbd>  | Show progress bar |
| <kbd>d</kbd>  | Scroll to description/video |
| <kbd>r</kbd>  | Focus first related video |
| <kbd>n</kbd>  | Comment |
| **Playlist** |
| <kbd>[</kbd>  | Focus first video in playlist |
| <kbd>]</kbd>  | Focus last video in playlist |
| **Channel** |
| <kbd>h</kbd>  | Go to channel |
| <kbd>H</kbd> (<kbd>Shift</kbd>+<kbd>h</kbd>) | Go to channel (new tab) |
| <kbd>v</kbd>  | Go to channel videos |
| <kbd>p</kbd>  | Go to channel playlists |

</details>

<br>

<details>
<summary>Twitch</summary>

| Shortcut | Description |
| -------- | ----------- |
| **General** |
| <kbd>E</kbd> (<kbd>Shift</kbd>+<kbd>e</kbd>) | Expand/collapse left sidebar |
| <kbd>u</kbd>  | Focus followed channels |
| <kbd>r</kbd>  | Focus recommended channels |
| **Stream** |
| <kbd>s</kbd>  | Open settings |
| <kbd>q</kbd>  | Open quality settings |
| <kbd>o</kbd>  | Go to stream category |
| <kbd>d</kbd>  | Scroll to description/video |
| <kbd>h</kbd>  | Go to online/offline channel sections |
| **Chat** |
| <kbd>c</kbd>  | Focus chat box |
| <kbd>e</kbd>  | Expand/collapse chat |
| **Channel** |
| <kbd>v</kbd>  | Go to channel videos |
| <kbd>b</kbd>  | Go to channel schedule |

</details>
