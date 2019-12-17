// This background script handles the initialization of the extension
chrome.runtime.onInstalled.addListener(function() {
  
  // Set default playback stored to 1.0
  chrome.storage.sync.set({playback: 1}, function() {
    console.log("Set default to " + 1);
  });

  // Make sure extension is only active on YouTube pages
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'www.youtube.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });  
});