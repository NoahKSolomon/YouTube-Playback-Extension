// This background script handles the initialization of the extension
chrome.runtime.onInstalled.addListener(() => {

  // Set default playback stored to 1.0
  chrome.storage.sync.set({playback: 1.0});

  // Make sure extension is only active on YouTube pages
  var rule1 = { // Rule that enables extension on youtube video pages
    conditions: [ 
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'www.youtube.com', pathContains: 'watch' }
      })
    ],
    actions: [ new chrome.declarativeContent.ShowPageAction() ]
  };
  // Add rule
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([rule1]);
  });  
});