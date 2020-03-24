// Playback rate of the current tab
var current_tab_playback = -1;

// Set the speed of the current tab
function setPlayback(speed) {
    if(speed != NaN && speed > 0) {
        document.getElementsByTagName("video")[0].playbackRate = speed;
        current_tab_playback = speed;
    }
}

// Check for existence of video tags to set playback of upon initial injection
if(!(document.getElementsByTagName("video")[0] === undefined)) {
    chrome.storage.sync.get('playback', data => {
        setPlayback(data.playback);
    });
}