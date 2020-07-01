

// Send a message to the current active tab
function setSpeedInActiveTab(speed) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => { // Get current active tab
        chrome.tabs.sendMessage(tabs[0].id, {newspeed: speed});
    }); 
}

// Listener to handle hotkeys for setting the playback speed to half, normal, double, and current default
chrome.commands.onCommand.addListener( command => {
    // Initially -1 to check for change
    let change_to = -1;
    // Discover what hotkey was pressed
    switch(command) {
        case 'set-half-speed':
            change_to = 0.5;
            break;
        case 'set-normal-speed':
            change_to = 1.0;
            break;
        case 'set-double-speed':
            change_to = 2.0;
            break;
        case 'set-default-speed':
            chrome.storage.sync.get('playback', data => {
                setSpeedInActiveTab(data.playback);
            });
            break;
        case 'increment-speed':
            chrome.tabs.query({active:true, currentWindow:true}, tabs => {
                chrome.storage.sync.get("increment", data => {
                    chrome.tabs.sendMessage(tabs[0].id, {increment: data.increment});
                });
            });
            break;
        case 'decrement-speed':
            chrome.tabs.query({active:true, currentWindow:true}, tabs => {
                chrome.storage.sync.get("increment", data => {
                    chrome.tabs.sendMessage(tabs[0].id, {increment: -data.increment});
                });
            });
            break;
    }
    // If changed
    if(change_to > 0) {
        // Send message to current active tab to update playback speed
        setSpeedInActiveTab(change_to);
    }
});