chrome.webNavigation.onCompleted.addListener(details => {
    chrome.storage.sync.get('playback', data => {
        if(data.playback != NaN && data.playback > 0) {
            chrome.tabs.executeScript(details.tabId, 
                {code:'document.getElementsByTagName("video")[0].playbackRate =' + data.playback +';'});
            
        }
    });
});