# Shortcuts For Sites

WebExtension that adds keyboard shortcuts for easier navigation on popular websites.

Available for Firefox on [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/shortcuts-for-sites/).

Available for Chrome ([Manual installation](#chrome-manual-installation) only).

## Description
This extension adds various keyboard shortcuts to some popular websites. You will be able to browse these websites with just your keyboard without relying too much on the <kbd>Tab</kbd> key.

Other methods of navigating websites with keyboard (besides using the <kbd>Tab</kbd> key) include using browser features like **find**, **quick find**, and **quick find within link-text only** (<kbd>Ctrl</kbd>+<kbd>f</kbd>, <kbd>/</kbd>, and <kbd>'</kbd> shortcuts in Firefox). These will move focus to the found element, without you having to <kbd>Tab</kbd> manually to it. But sometimes using <kbd>Tab</kbd> is unavoidable, and searching for elements every time can become old.

Some websites also have native shortcuts (usually displayed by pressing the <kbd>?</kbd> key). This extension complements or completely rewrites those shortcuts. For example, on Reddit (new Reddit) there are <kbd>j</kbd>/<kbd>k</kbd> shortcuts to go to the next/previous post/comment, but they work kind of poorly. This extension rewrites these shortcuts and adds other shortcuts to interact with the focused post (like **open post's subreddit** or **open post's image**).

## Useful tips
- Pressing <kbd>Alt</kbd>+<kbd>k</kbd> will display shortcuts for the current website.
- $\textcolor{green}{\text{Green outline}}$ means that the shortcut is usable right now.
- To use shortcuts that open links in new tabs (like Reddit's <kbd>g</kbd> **open post image**), you will need to allow the website to open pop-ups.
- On some websites, pressing <kbd>?</kbd> will display already available shortcuts.
- You can rebind shortcuts on extension's options page (preferences page).
- Press <kbd>Tab</kbd> once to force browser to draw focus outline.
- On Reddit, without logging in shortcuts will work poorly.
- Check out your browser's keyboard shortcuts ([Firefox](https://support.mozilla.org/en-US/kb/keyboard-shortcuts-perform-firefox-tasks-quickly)).

> __Note__
>
> If you are using Google Search or Google Translate on domains other than **.com**, enable **allow add-on to run on all Google domains** on add-on's options page.

## Popup
![Popup preview](https://user-images.githubusercontent.com/33831256/211046239-27a33466-e62f-4711-91f2-44d9a613e2e6.png)

## Demonstration
https://youtu.be/9MR6KKRwTP0

## Chrome manual installation
1. Go to [Add-on Releases](https://github.com/Shadou1/shortcuts-for-sites/releases).
2. Download the latest chrome release (it should end in **.chromium.zip**).
3. Go to [chrome://extensions](chrome://extensions) and enable **developer mode** (top right corner).
4. Drag **.zip** file onto Chrome browser, this will install the extension.
5. Disable **developer mode**.
> __Note__
>
> Google Search and Google Translate shortcuts will only work on **.com** domains, enabling **allow add-on to run on all Google domains** won't work in Chrome.

## How it works
Extension loads [content script](/content-scripts/init.ts) into sites that it has shortcuts for (defined in [manifest.json](manifest.json#L51)). Content script listens for [keydown](/content-scripts/init.ts#L88) events and executes corresponding [shortcut](shortcuts/) events. Shortcut events define what should happen when the user presses the shortcut's key. These events do a wide range of things: focusing and clicking elements, going to next/previous elements, opening menus (settings menus), navigating to different site sections, controlling video players, and more.

> __Note__
>
> Because sites can update their structure, be it html or javascript, shortcuts might break or stop working. If they did break, it means that I haven't updated the extension yet. Submit a new issue if shortcuts have been broken for some time.

## Building

### Requirements
- Node.js 18 or later

In root directory run:
```
npm install
```

### Building for Firefox
```
npm run build
```

Compiled code is in **dist** folder, zipped version is in **web-ext-artifacts** folder.

### Building for Chrome
```
npm run build-chromium
```

Compiled code is in **dist-chromium** folder, zipped version is in **web-ext-artifacts-chromium** folder.

## Running developer version

### Running in Firefox
- Run ```npm run watch```.
- Or go to [about:debugging](about:debugging), select **This Firefox**, click **Load Temporary Add-on**, choose **manifest.json** file in the **dist** folder.

### Running in chrome
- Run ```npm run watch-chromium```.
- Or go to [chrome://extensions](chrome://extensions), enable **Developer mode**, click **Load unpacked** and select **dist** folder, or drag **.zip** file from **web-ext-artifacts-chromium** onto chrome browser.

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
| **Posts** |
| <kbd>j</kbd> | Next post or comment |
| <kbd>k</kbd> | Previous post or comment |
| <kbd>K</kbd> (<kbd>Shift</kbd>+<kbd>k</kbd>) | First post or comment |
| <kbd>J</kbd> (<kbd>Shift</kbd>+<kbd>j</kbd>) | Last post or comment |
| <kbd>Enter</kbd> | Collapse/expand comment |
| **Post** |
| <kbd>b</kbd> | Go to post's subreddit (new tab) |
| <kbd>g</kbd> | Open post image (new tab) |
| <kbd>l</kbd> | Open post link (new tab) |
| <kbd>B</kbd> (<kbd>Shift</kbd>+<kbd>b</kbd>) | Go to post's subreddit (this tab) |
| <kbd>G</kbd> (<kbd>Shift</kbd>+<kbd>g</kbd>) | Open post image (this tab) |
| <kbd>L</kbd> (<kbd>Shift</kbd>+<kbd>l</kbd>) | Open post link (this tab) |
| <kbd>f</kbd> | Focus post on comments page |
| **Posts filters** |
| <kbd>1</kbd> | Hot posts |
| <kbd>2</kbd> | New posts |
| <kbd>3</kbd> | Top posts |
| <kbd>4</kbd> | Rising posts |
| <kbd>t</kbd> | Filter/sort posts/comments |
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
