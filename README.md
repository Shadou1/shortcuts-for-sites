# Shortcuts For Sites

WebExtension that adds keyboard shortcuts for easier navigation on popular websites.

## Description

Navigating websites without touching your mouse can be difficult. Although there are features like ***find***, ***quick find***, and ***quick find within link-text only*** (<kbd>Ctrl</kbd>+<kbd>f</kbd>, <kbd>/</kbd>, and <kbd>'</kbd> shortcuts in firefox) which can be used to focus needed elements, sometimes using <kbd>Tab</kbd> is unavoidable. Moreover, typing out search strings every time can become old. With this in mind, I implemented a number of shortcuts for different websites which should make navigating them with a keyboard more comfortable.

## Useful tips

- Pressing <kbd>Alt</kbd>+<kbd>k</kbd> will display shortcuts for the current website.
- $\textcolor{green}{\text{Green outline}}$ means that the shortcut is usable right now.
- On some websites, pressing <kbd>?</kbd> will display already available shortcuts.
- You can rebind shortcuts on extension's options page (preferences page).
- Press <kbd>Tab</kbd> once to force browser to draw focus outline.
- On Reddit, without logging in shortcuts will work poorly. Also native <kbd>j</kbd>/<kbd>k</kbd> shortcuts will sometimes stop working, pressing <kbd>Tab</kbd> or reloading the page will usually get them working again.

> __Note__
>
> If you are using Google Search or Google Translate on domains other than <code>.com</code>, enable ***allow add-on to run on all Google domains*** on add-on's options page.

## Popup

![Popup preview](https://user-images.githubusercontent.com/33831256/211046239-27a33466-e62f-4711-91f2-44d9a613e2e6.png)

## Demonstration

https://youtu.be/9MR6KKRwTP0

## How it works

Extension loads [content script](/content-scripts/init.js) into sites that it has shortcuts for (defined in [manifest.json](manifest.json)). Content script listens for [keydown](/content-scripts/init.js#L88) events and executes corresponding [shortcut](shortcuts/) events. Shortcut events define what should happen when the user presses the shortcut's key. These events do a wide range of things: focusing and clicking elements, going to next/previous elements, opening menus (settings menus), navigating to different site sections, controlling video players, and more. Sometimes there is functionality besides shourtcut events for the site, like [scrolling a page when an element is focused](/shortcuts/reddit/utilsActivePost.ts#L81).

> __Note__
>
> Because sites can update their structure, be it html or javascript, shortcuts might break or stop working. If they did break, it means that I haven't updated the extension yet. Submit a new issue if shortcuts have been broken for some time.

## Issues

- Focus outline won't render on some pages if the user hasn't pressed <kbd>Tab</kbd> at least once while on a page.
- On Twitch, <kbd>d</kbd> shortcut to scroll to stream description will work incorrectly the first time.
- On Youtube, going to channel videos/playlists from ***/watch*** will sometimes play channel's autoplay video in background.
- On Reddit, shortcuts work poorly without logging in.

## Full list of available shortcuts

<details>
<summary>Google Search</summary>

| Shortcut | Description |
| -------- | ----------- |
| **Search modes** |
| <kbd>a</kbd> | Go to all search results |
| <kbd>i</kbd> | Go to images |
| <kbd>v</kbd> | Go to videos |
| <kbd>n</kbd> | Go to news |
| **Search** |
| <kbd>j</kbd> | Focus next search result / image |
| <kbd>k</kbd> | Focus previous search result / image |
| <kbd>K</kbd> (<kbd>Shift</kbd>+<kbd>k</kbd>) | Focus first search result / image |
| <kbd>J</kbd> (<kbd>Shift</kbd>+<kbd>j</kbd>) | Focus last search result / image |
| <kbd>]</kbd> | Go to next search page |
| <kbd>[</kbd> | Go to previous search page |
| <kbd>o</kbd> | Focus next suggested search |

</details>

<br>

<details>
<summary>Google Translate</summary>

| Shortcut | Description |
| -------- | ----------- |
| **Translate** |
| <kbd>j</kbd> | Focus translate-from box |
| <kbd>Escape</kbd> | Unfocus translate-from box |
| <kbd>u</kbd> | Focus source languages |
| <kbd>o</kbd> | Focus translation languages |
| <kbd>i</kbd> | Swap languages |
| **Details** |
| <kbd>k</kbd> | Listen to source text |
| <kbd>l</kbd> | Listen to translation |
| <kbd>d</kbd> | Show/hide definitions |
| <kbd>e</kbd> | Show/hide examples |
| <kbd>t</kbd> | Show/hide translations |

</details>

<br>

<details>
<summary>Reddit</summary>

| Shortcut | Description |
| -------- | ----------- |
| **Navigation** |
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

<br>

<details>
<summary>Twitch</summary>

| Shortcut | Description |
| -------- | ----------- |
| **Sidebar** |
| <kbd>E</kbd> (<kbd>Shift</kbd>+<kbd>e</kbd>) | Expand/collapse left sidebar |
| <kbd>u</kbd> | Focus followed channels |
| <kbd>r</kbd> | Focus recommended channels |
| **Relevant content (stream, video...)** |
| <kbd>]</kbd> | Focus next relevant |
| <kbd>[</kbd> | Focus previous relevant |
| <kbd>{</kbd> | Focus first relevant |
| <kbd>}</kbd> | Focus last relevant |
| <kbd>\\</kbd> | Show more / all |
| **Navigation** |
| <kbd>o</kbd> | Go to home |
| <kbd>U</kbd> (<kbd>Shift</kbd>+<kbd>u</kbd>) | Go to following |
| <kbd>b</kbd> | Browse categories |
| <kbd>B</kbd> (<kbd>Shift</kbd>+<kbd>b</kbd>) | Browse live channels |
| <kbd>i</kbd> | Filter/sort by |
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
<summary>Youtube</summary>

| Shortcut | Description |
| -------- | ----------- |
| **Navigation** |
| <kbd>e</kbd> | Expand/Collapse guide sidebar |
| <kbd>o</kbd> | Go to Home |
| <kbd>u</kbd> | Go to Subscriptions |
| <kbd>U</kbd> (<kbd>Shift</kbd>+<kbd>u</kbd>) | Focus subscribed channels |
| **Videos** |
| <kbd>]</kbd> | Focus next video |
| <kbd>[</kbd> | Focus previous video |
| <kbd>{</kbd> | Focus first video |
| <kbd>}</kbd> | Focus last video |
| **Video Player** |
| <kbd>s</kbd> | Open settings |
| <kbd>q</kbd> | Open quality settings |
| <kbd>;</kbd> | Focus video player / show progress bar |
| <kbd>d</kbd> | Scroll to description/video |
| <kbd>n</kbd> | Comment |
| **Channel** |
| <kbd>h</kbd> | Go to channel home |
| <kbd>v</kbd> | Go to channel videos |
| <kbd>p</kbd> | Go to channel playlists |
| <kbd>H</kbd> (<kbd>Shift</kbd>+<kbd>h</kbd>) | Go to channel (new tab) |
| **Playlist** |
| <kbd>,</kbd> | Focus first video in playlist |
| <kbd>.</kbd> | Focus last video in playlist |
| **Premiere/Stream** |
| <kbd>E</kbd> (<kbd>Shift</kbd>+<kbd>e</kbd>) | Hide/Show chat |
| <kbd>b</kbd> | Chat |
| <kbd>S</kbd> (<kbd>Shift</kbd>+<kbd>s</kbd>) | Skip ahead to live broadcast |

</details>
