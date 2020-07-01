var tab_list = new Array();

// This listener is used to check for a tab being updated to a new YouTube video from
// a YouTube video already. This has to be here as there is no redirect to the new video page
// so there has to be a listener which checks if if a tab moved to a new video and should
// have the content script injected again
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if("url" in changeInfo) { // Check for url

        console.log("changeInfo has url: " + changeInfo.url);
        let cont_yt = changeInfo.url.search("youtube.com/watch");

        if(cont_yt !== -1) { // Check for updated url to be to a YouTube video

            if("status" in changeInfo) {
                if(changeInfo.status === "loading") { // If loading, store in list to inject on complete

                    console.log("Tab loading, storing tab " + tabId + " to inject later");
                    tab_list.push(tabId);

                } else if(changeInfo.status === "complete") { // If completed, inject script

                    console.log("Tab complete, messaging tab " + tabId);
                    ensureSendMessage(tabId, {"fromBackground": true, "refresh": true}, (response) => {
                        if(!chrome.runtime.lastError.message) {
                            console.log("Got response from tab " + tabId + ": " + response.refreshed);
                        } else {
                            console.log("ERROR: " + chrome.runtime.lastError.message)
                        }
                    });
                    // chrome.tabs.sendMessage(tabId, {"fromBackground": true, "refresh": true}, (response) => {
                    //     if(!chrome.runtime.lastError.message) {
                    //         console.log("Got response from tab " + tabId + ": " + response.refreshed);
                    //     } else {
                    //         console.log("ERROR: " + chrome.runtime.lastError.message)
                    //     }
                    // });
                }
            }
        }
    } else if("status" in changeInfo && changeInfo.status === "complete") {

        if(tab_list.includes(tabId)) { // Tab waiting for content script

            console.log("Tab complete, messaging tab " + tabId + " from stored tab list");
            ensureSendMessage(tabId, {"fromBackground": true, "refresh": true}, (response) => {
                if(!chrome.runtime.lastError) {
                    console.log("Got response from tab " + tabId + ": " + response.refreshed);
                } else {
                    console.log("ERROR: " + chrome.runtime.lastError.message)
                }
            });
            // chrome.tabs.sendMessage(tabId, {"fromBackground": true, "refresh": true}, (response) => {
            //     if(!chrome.runtime.lastError) {
            //         console.log("Got response from tab " + tabId + ": " + response.refreshed);
            //     } else {
            //         console.log("ERROR: " + chrome.runtime.lastError.message)
            //     }
            // });

            console.log("Removing tab " + tabId + " from list to update");
            tab_list.filter((value, index, array) => {
                return value != tabId;
            }); // Remove from map
        }
    }
});


// mplement this from https://stackoverflow.com/questions/23895377/sending-message-from-a-background-script-to-a-content-script-then-to-a-injected

// Background
function ensureSendMessage(tabId, message, callback){
  chrome.tabs.sendMessage(tabId, {checkInjected: true}, (response) => {
    if(response && response.injected) { // Content script ready
      chrome.tabs.sendMessage(tabId, message, callback);
    } else if (chrome.runtime.lastError){ // No listener on the other end
      chrome.tabs.executeScript(tabId, {file: "js/content/set_playback.js"}, () => {
        if(chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          throw Error("Unable to inject script into tab " + tabId);
        }
        // OK, now it's injected and ready
        chrome.tabs.sendMessage(tabId, message, callback);
      });
    }
  });
}

// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   ensureSendMessage(tabs[0].id, {greeting: "hello"});
// });