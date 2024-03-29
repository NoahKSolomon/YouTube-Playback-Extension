var vid = document.getElementsByTagName("video")[0];
var time_ui = null;
var inc_ui = null;
var cutoff = 0;
var enable_for_livestream = false;

// Determine if the current youtube video is a livestream
function is_livestream() {
    return window.getComputedStyle(document.getElementsByClassName("ytp-live-badge")[0]).display !== 'none';
}

// Attach listeners to the video tag which handles updating the ui
function attach_ui_events() {
    if (vid === undefined) {
        vid = document.getElementsByTagName("video")[0]
    }
    vid.addEventListener("durationchange", update_time_ui);
    vid.addEventListener("durationchange", check_cutoff_time);
    vid.addEventListener("ratechange", update_time_ui);
    vid.addEventListener("timeupdate", update_time_ui);
    //vid.addEventListener("ratechange", update_increment_key_pressed_ui);
}

// This function is responsible for updating the speed for videos under the duration
function check_cutoff_time() {
    
    if (!is_livestream() || enable_for_livestream) {
        console.log("Setting playback due to enabled or not livestream");
        console.log("is livestream = " + is_livestream());
        console.log("enabled for livestream: " + enable_for_livestream);
        console.log("vid.duration = " + vid.duration);
        console.log("cutoff = " + cutoff);
        if (vid.duration <= cutoff) {
            vid.playbackRate = 1;
            console.log("Setting to 1x");
        } else {
            console.log("Not setting back to 1x");
            chrome.storage.sync.get(['playback', 'cutoff'], data => {
                if(data.playback !== NaN && data.playback > 0) {
                    vid = document.getElementsByTagName("video")[0];
                    cutoff = data.cutoff;
                    if (vid.duration > data.cutoff) {
                        console.log("Set from check_cutoff_time callback");
                        console.log("vid.duration = " + vid.duration);
                        console.log("cutoff = " + cutoff);
                        vid.playbackRate = data.playback;
                    }
                }
            });
        }
    } else {
        console.log("did not set due to livestream");
        console.log("Is a livestream: " + is_livestream());
        console.log("Enabled for livestream: " + enable_for_livestream);
    }

    
    
}

// This function adds a new element next to the duration time of the video which contains
// the actual time it will take to watch the video with the current speed
function update_time_ui() {
    //let vid = document.getElementsByTagName("video")[0];
    let disp = document.getElementsByClassName("ytp-time-duration")[0];
    if (vid == undefined) {
        vid = document.getElementsByTagName("video")[0];
    }
    let true_dur = vid.duration / vid.playbackRate;
    
    // Calculate the duration with the current speed
    // 3600 --> Number of seconds in one hour
    // 60   --> Number of seconds in one minute
    let hours = Math.floor(true_dur / 3600); // Length of video in hours
    let minute_overflow = Math.floor(true_dur / 60) - hours * 60; // Leftover minutes after removing hours
    let second_overflow = Math.floor(true_dur - Math.floor(true_dur / 60) * 60); // Leftover seconds after removing minutes
    let total_time_str = "";
    total_time_str = second_overflow.toFixed(0); // Set seconds
    if(second_overflow < 10) total_time_str = "0" + total_time_str; // Pad seconds with 0 if needed
    total_time_str = minute_overflow.toFixed(0) + ":" + total_time_str; // Set minutes
    if(hours > 0) { // If hours exist
        if(minute_overflow < 10) { // Pad minutes with 0 if needed
            total_time_str = "0" + total_time_str;
        }
        total_time_str = hours + ":" + total_time_str; // Set hours
    }

    // Calculate the duration with the current speed
    // 3600 --> Number of seconds in one hour
    // 60   --> Number of seconds in one minute
    let true_cur_dur = vid.currentTime / vid.playbackRate;
    hours = Math.floor(true_cur_dur / 3600); // Length of video in hours
    minute_overflow = Math.floor(true_cur_dur / 60) - hours * 60; // Leftover minutes after removing hours
    second_overflow = Math.floor(true_cur_dur - Math.floor(true_cur_dur / 60) * 60); // Leftover seconds after removing minutes
    var cur_time_str = "";
    cur_time_str = second_overflow.toFixed(0); // Set seconds
    if(second_overflow < 10) cur_time_str = "0" + cur_time_str; // Pad seconds with 0 if needed
    cur_time_str = minute_overflow.toFixed(0) + ":" + cur_time_str; // Set minutes
    if(hours > 0) { // If hours exist
        if(minute_overflow < 10) { // Pad minutes with 0 if needed
            cur_time_str = "0" + cur_time_str;
        }
        cur_time_str = hours + ":" + cur_time_str; // Set hours
    }
    
    var rate_str = vid.playbackRate.toString().slice(0,4)

    if (vid.duration) { // make sure video loaded
        let elem = document.getElementById("new-time-ytpbs");
        if(!elem) { // Need to initialize time ui
            // Fetch time_ui html element from extension
            fetch(chrome.runtime.getURL("html/time_ui.html")) 
                .then(response => response.text())
                .then(data => {
                    // Check that element doesn't already exist before inserting
                    if (!document.getElementById("new-time-ytpbs")) {
                        let inject_tag = data.replace("><", ">(" + cur_time_str + "/" + total_time_str + ") " + rate_str + "x<"); // Insert time
                        disp.insertAdjacentHTML('afterend', inject_tag); // Place into YT page
                    }
                }).catch(err => {
                    console.log("YOUTUBE DEFAULT SPEED EXTENSION ERROR: " + err);
                });
        } else { // time ui has been initialized
            elem.innerHTML = "(" + cur_time_str + "/" + total_time_str + ") " + rate_str + "x";
        }
    }
}

// Update the ui for when the user used the increment/decrement hotkey
function update_increment_key_pressed_ui() {
    // TODO: Add speed popup when using increment/decrement buttons
    // The elements that YouTube uses: div with class="ytp-bezel-text-wrapper"
    // and a div with class="ytp-bezel" role="status" aria-label="XXvolume"
    // and a div with class="ytp-bezel-icon" with an svg tag in it
    let elem = document.getElementById("increment-disp-wrapper");
    console.log("elem: " + elem);
    console.log("!elem: " + !elem);
    if(!elem) { // Increment element doesn't exist, need to initalize
        fetch(chrome.runtime.getURL("html/increment_ui.html")) 
                .then(response => response.text())
                .then(data => {
                    if(!document.getElementById("increment-disp-wrapper")) {
                        let volume_display = document.getElementsByClassName("ytp-bezel-text-wrapper")[0].parentElement;
                        let all_tags = data.replace(">target<", ">" + vid.playbackRate + "<"); // Insert time
                        let style_tag = all_tags.slice(0,all_tags.indexOf("</style>") + 8);
                        let inject_div = all_tags.slice(all_tags.indexOf("div") - 1);
                        document.getElementById("head").insertAdjacentHTML("beforeend", style_tag);
                        volume_display.insertAdjacentHTML('afterend', inject_div); // Place into YT page
                    }
                }).catch(err => {
                    console.log("YOUTUBE DEFAULT SPEED EXTENSION ERROR: " + err);
                });
    } else { // Incremement element exists, just update
        elem.innerHTML = "(" + vid.playbackRate + ")";
    }
}

/*
 * Start the actual script
 */

// Check for existence of video tags to set playback of upon initial injection
if(document.getElementsByTagName("video")[0] !== undefined) {
    chrome.storage.sync.get(['playback', 'cutoff', 'enable_for_livestream'], data => {
        if(data.playback !== NaN && data.playback > 0) {
        	vid = document.getElementsByTagName("video")[0];
            cutoff = data.cutoff;
            enable_for_livestream = data.enable_for_livestream;
            if (vid.duration > cutoff) {
                if (!is_livestream() || enable_for_livestream) {
                    console.log("Set from script portion of content script");
                    console.log("vid.duration = " + vid.duration);
                    console.log("cutoff = " + cutoff);
                    vid.playbackRate = data.playback;
                }
            }
            attach_ui_events();
            update_time_ui();
            //update_increment_key_pressed_ui();
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
            response({"refreshed": "completed refreshing of ui in tab"});
            update_time_ui();
        // background script telling content script to change playback rate
        } else if (message.newspeed) {
            // if vid makes cutoff and livestream set speed is allowed or is from a hotkey
            if ((vid.duration > cutoff && (!is_livestream() || enable_for_livestream)) || message.hotkey) {
                if (message.hotkey) console.log("Setting speed from hotkey");
                else console.log("Setting speed dur to cutoff: dur = " + vid.duration + " > cutoff = " + cutoff);
                vid.playbackRate = message.newspeed;
            }
        } else if (message.increment) {
            let cur_speed = vid.playbackRate;
            vid.playbackRate = cur_speed + message.increment;
        } else if ('enable_for_livestream' in message) {
            enable_for_livestream = message.enable_for_livestream;
        }
    }
});