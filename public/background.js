(() => {
  // src/background.js
  chrome.action.onClicked.addListener(async (tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["scrapper.js"]
    });
  });
  chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "safePort") {
      port.onMessage.addListener((message) => {
        console.log(message);
      });
    }
  });
})();
