var vid = document.getElementsByTagName("video")[0];
console.log("Content Script Injected");

// Attach listeners to the video tag which handles updating the time ui
function attach_time_ui_events() {
    if (vid === undefined) {
        vid = document.getElementsByTagName("video")[0]
    }
    vid.addEventListener("durationchange", update_time_ui);
    vid.addEventListener("ratechange", update_time_ui);
}

// This function adds a new element next to the duration time of the video which contains
// the actual time it will take to watch the video with the current speed
function update_time_ui() {
    //let vid = document.getElementsByTagName("video")[0];
    let disp = document.getElementsByClassName("ytp-time-duration")[0];
    if (vid == undefined) {
        vid = document.getElementsByTagName("video")[0];
    }
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

    
    console.log("video element: " + vid);
    console.log("vid.duration = " + vid.duration);
    console.log("vid.playbackRate = " + vid.playbackRate);
    console.log("hours = " + hours);
    console.log("minute_overflow = " + minute_overflow);
    console.log("second_overflow = " + second_overflow);
    

    if (vid.duration) { // make sure video loaded
        console.log("video duration is a number (" + vid.duration + "), initalizing time ui");
        let elem = document.getElementById("new-time-ytpbs");
        if(!elem) { // Need to initialize time ui
            // Fetch time_ui html element from extension
            fetch(chrome.runtime.getURL("html/time_ui.html")) 
                .then(response => response.text())
                .then(data => {
                    // Check that element doesn't already exist before inserting
                    if (!document.getElementById("new-time-ytpbs")) {
                        let inject_tag = data.replace("><", ">(" + time_str + ")<"); // Insert time
                        disp.insertAdjacentHTML('afterend', inject_tag); // Place into YT page
                    }
                }).catch(err => {
                    console.log("YOUTUBE DEFAULT SPEED EXTENSION ERROR: " + err);
                });
        } else { // time ui has been initialized
            elem.innerHTML = "(" + time_str + ")";
        }
    }
}

// Update the ui for when the user used the increment/decrement hotkey
function update_increment_key_pressed_ui() {
    // TODO: Add speed popup when using increment/decrement buttons
    // The elements that YouTube uses: div with class="ytp-bezel-text-wrapper"
    // and a div with class="ytp-bezel" role="status" aria-label="XXvolume"
    // and a div with class="ytp-bezel-icon" with an svg tag in it
    let volume_display = document.getElementsByClassName("ytp-bezel-text")[0].parentElement;
    let elem = document.getElementById("increment-ytpbs");
    if(!elem) { // Increment element doesn't exist, need to initalize
        fetch(chrome.runtime.getURL("html/increment_ui.html")) 
                .then(response => response.text())
                .then(data => {
                    if(!document.getElementById("increment-ytpbs")) {
                        let inject_tag = data.replace(">target<", ">(" + time_str + ")<"); // Insert time
                        disp.insertAdjacentHTML('afterend', inject_tag); // Place into YT page
                    }
                }).catch(err => {
                    console.log("YOUTUBE DEFAULT SPEED EXTENSION ERROR: " + err);
                });
    } else { // Incremement element exists, just update

    }
    

}

/*
 * Start the actual script
 */

// Check for existence of video tags to set playback of upon initial injection
if(document.getElementsByTagName("video")[0] !== undefined) {
    chrome.storage.sync.get('playback', data => {
        if(data.playback != NaN && data.playback > 0) {
        	vid = document.getElementsByTagName("video")[0];
            vid.playbackRate = data.playback;
            attach_time_ui_events();
            update_time_ui();
        }
    });
}

// Listen to background page for when to refresh ui in page
// Typically when we move to a new video page but the content
// script is not re-injected
chrome.runtime.onMessage.addListener((message, sender, response) => {
    if(!chrome.runtime.lastError) {
        // Background page checking that content script has been injected
        if(message.checkInjected) {
            response({injected: true});
            return;
        // background script telling content script to update ui
        } else if (message.fromBackground && message.refresh) {
            console.log("Refreshing UI from navigation listener");
            response({"refreshed": "completed refreshing of ui in tab"});
            update_time_ui();
        // background script telling content script to change playback rate
        } else if (message.newspeed) {
            console.log("Message: set new speed to " + message.newspeed);
            vid.playbackRate = message.newspeed;
            //update_time_ui();
        } else if (message.increment) {
            console.log("Mesage: increment speed by " + message.increment);
            let cur_speed = vid.playbackRate;
            vid.playbackRate = cur_speed + message.increment;
            //update_time_ui();
        }
        
    }
});