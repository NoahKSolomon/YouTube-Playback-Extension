if(!(document.getElementsByTagName("video")[0] === undefined)) {
    let vid = document.getElementsByTagName("video")[0];
    let cur_speed = vid.playbackRate;
    vid.playbackRate = cur_speed + 0.25;
}