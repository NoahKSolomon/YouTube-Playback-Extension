// Send a message to the current active tab
function messageActiveTab(message) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => { // Get current active tab
        chrome.tabs.sendMessage(tabs[0].id, message); // Message current active tab to set new speed
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
                messageActiveTab({newSpeed: data.playback});
            });
            break;
    }
    // If changed
    if(change_to > 0) {
        // Send message to current active tab to update playback speed
        messageActiveTab({newSpeed: change_to});
    }
});