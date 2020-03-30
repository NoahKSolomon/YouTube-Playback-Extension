// Check for existence of video tags to set playback of upon initial injection
if(!(document.getElementsByTagName("video")[0] === undefined)) {
    console.log("CONTENT SCRIPT EXECUTED");
    chrome.storage.sync.get('playback', data => {
        if(data.playback != NaN && data.playback > 0) {
            console.log("SETTING VIDEO PLAYBACK TO " + data.playback);
            document.getElementsByTagName("video")[0].playbackRate = data.playback;
        }
    });
}