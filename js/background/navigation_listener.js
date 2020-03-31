var tab_list = new Array();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("onUpdated fired");
    console.log(changeInfo);
    console.log(tab);
    if("url" in changeInfo) { // Check for url
        console.log("changeInfo has url: " + changeInfo.url);
        let cont_yt = changeInfo.url.search("youtube.com/watch");
        if(cont_yt !== -1) { // Check for updated url to be to a YouTube video
            console.log("url contains youtube.com/watch at position: " + cont_yt);
            if("status" in changeInfo) {
                if(changeInfo.status === "loading") { // If loading, store in list to inject on complete
                    tab_list.push(tabId);
                    console.log("Saving to list: " + tabId + " --> " + changeInfo.url);
                } else if(changeInfo.status === "complete") { // If completed, inject script
                    chrome.tabs.executeScript(tabId, {
                        file:"/js/content/set_playback.js"
                    });
                    console.log("Sent content script to tab");
                }
            }
        }
    } else if("status" in changeInfo && changeInfo.status === "complete") {
        if(tab_list.includes(tabId)) { // Tab waiting for content script
            console.log("Injectting script into tab " + tabId + " from map");
            chrome.tabs.executeScript(tabId, {
                file:"/js/content/set_playback.js"
            });
            tab_list.filter((value, index, array) => {
                return value != tabId;
            }); // Remove from map
        }
    }
});