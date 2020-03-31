var tab_list = new Array();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if("url" in changeInfo) { // Check for url
        console.log("changeInfo has url: " + changeInfo.url);
        let cont_yt = changeInfo.url.search("youtube.com/watch");
        if(cont_yt !== -1) { // Check for updated url to be to a YouTube video
            if("status" in changeInfo) {
                if(changeInfo.status === "loading") { // If loading, store in list to inject on complete
                    tab_list.push(tabId);
                } else if(changeInfo.status === "complete") { // If completed, inject script
                    chrome.tabs.executeScript(tabId, {
                        file:"/js/content/set_playback.js"
                    });
                }
            }
        }
    } else if("status" in changeInfo && changeInfo.status === "complete") {
        if(tab_list.includes(tabId)) { // Tab waiting for content script
            chrome.tabs.executeScript(tabId, {
                file:"/js/content/set_playback.js"
            });
            tab_list.filter((value, index, array) => {
                return value != tabId;
            }); // Remove from map
        }
    }
});