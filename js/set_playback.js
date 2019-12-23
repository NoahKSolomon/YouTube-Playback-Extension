/*
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
*/

// Possibly helpful
// http://jsfiddle.net/8R5y6/

if(!(document.getElementsByTagName("video")[0] === undefined)) {
    chrome.storage.sync.get('playback', function(data) {
        document.getElementsByTagName("video")[0].playbackRate = data.playback;
    });
}