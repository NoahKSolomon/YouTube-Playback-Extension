// This background script handles the hotkeys for setting the playback speed to half, normal, and double
chrome.commands.onCommand.addListener(function(command) {
    switch(command) {
        case 'set-half-speed':
            console.log("SETTING NORMAL SPEED");
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.executeScript(
                  tabs[0].id,
                  {code: 'document.getElementsByTagName("video")[0].playbackRate = 0.5;'}
                );
            });
            break;
        case 'set-normal-speed':
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.executeScript(
                  tabs[0].id,
                  {code: 'document.getElementsByTagName("video")[0].playbackRate = 1.0;'}
                );
            });
            break;
        case 'set-double-speed':
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.executeScript(
                  tabs[0].id,
                  {code: 'document.getElementsByTagName("video")[0].playbackRate = 2.0;'}
                );
            });
            break;
    }
});