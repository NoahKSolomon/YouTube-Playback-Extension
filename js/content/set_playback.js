// Check for existence of video tags to set playback of upon initial injection
if(!(document.getElementsByTagName("video")[0] === undefined)) {
    chrome.storage.sync.get('playback', data => {
        if(speed != NaN && speed > 0) {
            document.getElementsByTagName("video")[0].playbackRate = speed;
        }
    });
}