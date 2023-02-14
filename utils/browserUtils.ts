const isFirefox = browser.runtime.getURL('').startsWith('moz-extension://');
const isChrome = browser.runtime.getURL('').startsWith('chrome-extension://');

export const browserName = isFirefox && 'firefox' || isChrome && 'chrome'
