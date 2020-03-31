
// Check for existence of video tags to set playback of upon initial injection
if(!(document.getElementsByTagName("video")[0] === undefined)) {
    console.log("Found video element");
    injected_script = true;
    chrome.storage.sync.get('playback', data => {
        if(data.playback != NaN && data.playback > 0) {
            console.log("Setting video playback to " + data.playback);
            document.getElementsByTagName("video")[0].playbackRate = data.playback;
        }
    });
}
console.log("Content script executed");