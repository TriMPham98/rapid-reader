// Register context menu on extension install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'rapid-reader',
    title: 'Read with Rapid Reader',
    contexts: ['selection']
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'rapid-reader' && info.selectionText) {
    // Store selected text
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
      // Open popup
      chrome.action.openPopup();
    });
  }
});
