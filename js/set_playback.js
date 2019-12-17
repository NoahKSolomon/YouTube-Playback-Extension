chrome.storage.sync.get('playback', function(data) {
    document.getElementsByTagName("video")[0].playbackRate = data.playback;
});