/**
 * God Mode browser extension — background service worker (scaffold).
 */
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});
