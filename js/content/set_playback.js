var keys_currently_down = {
    "alt": false,
    "up": false,
    "down": false
};

// Act as a wrapper for the 'update_ui' function as the data may not always be loaded
// This is an event listener for the 'durationchange' event for the video tag
function update_ui_wrapper(event) {
    console.log("TRIGGERING UI INIT");
	update_ui();
	document.getElementsByTagName("video")[0]
        .removeEventListener("durationchange", update_ui_wrapper);
}

// Update all the injected ui for the extension
function update_ui() {
	update_time_ui();
    //update_increment_key_pressed_ui();
}

// This function adds a new element next to the duration time of the video which contains
// the actual time it will take to watch the video with the current speed
function update_time_ui() {
    let vid = document.getElementsByTagName("video")[0];
    let disp = document.getElementsByClassName("ytp-time-duration")[0];
    let dur = vid.duration / vid.playbackRate;
    
    // Calculate the duration with the current speed
    // 3600 --> Number of seconds in one hour
    // 60   --> Number of seconds in one minute
    let hours = Math.floor(dur / 3600); // Length of video in hours
    let minute_overflow = Math.floor(dur / 60) - hours * 60; // Leftover minutes after removing hours
    let second_overflow = Math.floor(dur - Math.floor(dur / 60) * 60); // Leftover seconds after removing minutes
    let time_str = "";
    time_str = second_overflow.toFixed(0); // Set seconds
    if(second_overflow < 10) time_str = "0" + time_str; // Pad seconds with 0 if needed
    time_str = minute_overflow.toFixed(0) + ":" + time_str; // Set minutes
    if(hours > 0) { // If hours exist
        if(minute_overflow < 10) { // Pad minutes with 0 if needed
            time_str = "0" + time_str;
        }
        time_str = hours + ":" + time_str; // Set hours
    }
    

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

// Update the ui for when the user used the increment/decrement hotkey
function update_increment_key_pressed_ui() {
    // TODO: Add speed popup when using increment/decrement buttons
    // The elements that YouTube uses: div with class="ytp-bezel-text-wrapper"
    // and a div with class="ytp-bezel" role="status" aria-label="XXvolume"
    // and a div with class="ytp-bezel-icon" with an svg tag in it
    let bez_text_wrapper = document.getElementsByClassName("ytp-bezel-text")[0];
    console.log(bez_text_wrapper);
    let new_wrapper = bez_text_wrapper.cloneNode(true);
    bez_text_wrapper.insertAdjacentHTML("beforebegin", new_wrapper);
    new_wrapper.onkeydown(event => {
        if(event.keyCode === 18) {  // Alt key pressed
            keys_currently_down["alt"] = true;
        } else if(event.keyCode === 38) {  // Up arrow pressed
            keys_currently_down["up"] = true;
        } else if(event.keyCode === 40) {  // Down arrow pressed
            keys_currently_down["down"] = true;
        }
        console.log("KEYDOWN: ");
        console.log(keys_currently_down);
    });
    new_wrapper.onkeyup(event => {
        if(event.keyCode === 18) { // Alt key pressed
            keys_currently_down["alt"] = false;
        } else if(event.keyCode === 38) {  // Up arrow pressed
            keys_currently_down["up"] = false;
        } else if(event.keyCode === 40) {  // Down arrow pressed
            keys_currently_down["down"] = false;
        }
        console.log("KEYUP: ");
        console.log(keys_currently_down);
    });
}

/*
 * Start the actual script
 */

// Check for existence of video tags to set playback of upon initial injection
if(document.getElementsByTagName("video")[0] !== undefined) {
    chrome.storage.sync.get('playback', data => {
        if(data.playback != NaN && data.playback > 0) {
        	let vid = document.getElementsByTagName("video")[0];
            vid.playbackRate = data.playback;
            //window.addEventListener('load', update_ui_wrapper)
        	vid.addEventListener("durationchange", update_ui_wrapper);
            update_ui();
        }
    });
}