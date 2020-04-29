// Act as a wrapper for the 'add_new_time' function as the duration may not be set sometimes
// This is an event listener for the 'durationchange' event for the video tag
function add_new_time_wrapper(event) {
	add_new_time();
	document.getElementsByTagName("video")[0]
        .removeEventListener("durationchange", add_new_time_wrapper);
}

// This function adds a new element next to the duration time of the video which contains
// the actual time it will take to watch the video with the current speed
function add_new_time() {
	let vid = document.getElementsByTagName("video")[0];
	let disp = document.getElementsByClassName("ytp-time-duration")[0];
    let dur = vid.duration / vid.playbackRate;
    
	// Calculate the duration with the current speed
	let hours = Math.floor(dur / 3600);
    let minutes = Math.floor(dur / 60) - hours * dur;
    let seconds = dur - minutes * 60;
    let time_str = "";
    time_str = (seconds < 10) ? "0" + seconds.toFixed(0) : seconds.toFixed(0);
    time_str = (minutes < 10 && hours > 0) ? "0" + minutes.toFixed(0) + ":" + time_str : minutes.toFixed(0) + ":" + time_str;
    time_str = (hours > 0) ? hours + ":" + time_str : time_str;

    // Check whether the new time element has been added yet or not
    let elem = disp.nextSibling;
    if (elem.id !== "new-time-ytpbs") {
		let inject_tag = "<span id=\"new-time-ytpbs\" class=\"ytp-time-duration\" style=\"margin-left: 5px;\">(" 
    					+ time_str + ")</span>";
    	disp.insertAdjacentHTML('afterend', inject_tag);
    } else {
    	elem.innerHTML = "(" + time_str + ")";
    }
    
}

// Check for existence of video tags to set playback of upon initial injection
if(document.getElementsByTagName("video")[0] !== undefined) {
    chrome.storage.sync.get('playback', data => {
        if(data.playback != NaN && data.playback > 0) {
        	let vid = document.getElementsByTagName("video")[0];
        	vid.playbackRate = data.playback;
        	vid.addEventListener("durationchange", add_new_time_wrapper);
            add_new_time();
        }
    });
}

// TODO: Add speed popup when using increment/decrement buttons
// The elements that YouTube uses: div with class="ytp-bezel-text-wrapper"
// and a div with class="ytp-bezel" role="status" aria-label="XXvolume"
// and a div with class="ytp-bezel-icon" with an svg tag in it