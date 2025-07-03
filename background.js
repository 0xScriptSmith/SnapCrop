chrome.action.onClicked.addListener((tab) => {
  console.log("SnapCrop: Icon clicked. Trying to inject content script...");

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ["content-script.js"]
    },
    (results) => {
      if (chrome.runtime.lastError) {
        console.error("SnapCrop injection failed:", chrome.runtime.lastError.message);
      } else {
        console.log("SnapCrop: Content script injected successfully.");
      }
    }
  );
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CAPTURE_SCREENSHOT") {
    console.log("SnapCrop: Received CAPTURE_SCREENSHOT message.");

    chrome.tabs.captureVisibleTab(sender.tab.windowId, { format: "png" }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        console.error("SnapCrop: captureVisibleTab failed:", chrome.runtime.lastError.message);
        sendResponse({ screenshot: null, error: chrome.runtime.lastError.message });
      } else if (!dataUrl) {
        console.error("SnapCrop: captureVisibleTab returned null.");
        sendResponse({ screenshot: null, error: "captureVisibleTab returned null." });
      } else {
        console.log("SnapCrop: Screenshot captured successfully.");
        sendResponse({ screenshot: dataUrl });
      }
    });

    return true; // async response
  }
});
