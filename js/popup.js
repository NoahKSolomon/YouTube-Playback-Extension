let speed_parag = document.getElementById("display_speed");
let inc_parag = document.getElementById("display_inc");
let set_save_button = document.getElementById("playback_set_save_button");
let speed_input_tag = document.getElementById("playback_input");
let inc_input_tag = document.getElementById("inc_input");
let cutoff_parag = document.getElementById("time_cutoff_p");
let cutoff_input_minutes = document.getElementById("time_cutoff_input_minutes");
let cutoff_input_seconds = document.getElementById("time_cutoff_input_seconds");
let set_cutoff_button = document.getElementById("set_cutoff_button");
let livestream_checkbox = document.getElementById("livestream_check");

// Set the speed of the current active tab
function updateSpeed(speed, save_as_default=false) {
  // Check for valid speeds
  if(speed != NaN && speed > 0) { // Valid speed
    // Save 'speed' as new dafault
    if(save_as_default) {
      chrome.storage.sync.set({playback: speed}, function() {
        // Display new default speed
        speed_parag.innerHTML = "Current default: " + speed + "x";
        // Set speed of current tab
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
          // Message current tab to set new speed
          chrome.tabs.sendMessage(tabs[0].id, {newspeed:speed});
        });
      });
    } else { // Don't save speed as default
      // Get current active tab
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        // Message current tab to set new speed
        chrome.tabs.sendMessage(tabs[0].id, {newspeed:speed});
      });
    }
  }
}

// Display current default speed in popup.html
chrome.storage.sync.get(['playback', 'increment', 'cutoff', 'enable_for_livestream'], data => {
  speed_parag.innerHTML = "Current default: " + data.playback + "x";
  inc_parag.innerHTML = "Current increment: " + data.increment + "x";
  let seconds = data.cutoff % 60 >= 10 ? (data.cutoff % 60) : "0" + (data.cutoff % 60);
  cutoff_parag.innerHTML = "Current cutoff: " + Math.floor(data.cutoff / 60) + ":" + seconds;
  speed_input_tag.value = data.playback;
  inc_input_tag.value = data.increment;
  cutoff_input_minutes.value = Math.floor(data.cutoff / 60);
  cutoff_input_seconds.value = data.cutoff % 60;
  livestream_checkbox.checked = data.enable_for_livestream;
});

// Set the enter key press to activate the 'save' button
speed_input_tag.addEventListener("keyup", event => {
  // Key 13 is the enter key
  if(event.keyCode === 13) {
    event.preventDefault();
    set_save_button.click();
  }
});

inc_input_tag.addEventListener("keyup", event => {
  // Key 13 is the enter key
  if(event.keyCode === 13) {
    event.preventDefault();
    inc_set_save_button.click();
  }
});

cutoff_input_minutes.addEventListener("keyup", event => {
  // Key 13 is the enter key
  if(event.keyCode === 13) {
    event.preventDefault();
    set_cutoff_button.click();
  }
});

cutoff_input_seconds.addEventListener("keyup", event => {
  // Key 13 is the enter key
  if(event.keyCode === 13) {
    event.preventDefault();
    set_cutoff_button.click();
  }
});

// Set the onclick functions for buttons
var buttons = document.getElementById('yt_def_sp_body').getElementsByClassName('red');
for(var i = 0; i < buttons.length; i++) {
  if(buttons[i].id === 'playback_set_save_button') { // Set the onclick method for the save speed button
    buttons[i].onclick = element => {
        let to_save = Number(speed_input_tag.value);
        // Set actual speed in tab
        console.log("Set Speed onclick");
        updateSpeed(to_save, true);
      
    };
  } else if (buttons[i].id === 'inc_set_save_button') { // Set onclick functions for set increment button
    buttons[i].onclick = element => {
      let to_save = Number(inc_input_tag.value);
      console.log("Set Increment onclick");
      // Check for valid video speeds
      if(to_save != NaN && to_save > 0) {
        chrome.storage.sync.set({increment: to_save}, function() {
          inc_parag.innerHTML = "Current increment: " + to_save + "x";
        });
      } else {
        inc_parag.innerHTML = "Not a valid video speed. Input another speed.";
      }
    };
  } else if (buttons[i].id === 'set_cutoff_button') { // Set onclick for set cutoff button
    buttons[i].onclick = element => {
      let to_save = Number(cutoff_input_minutes.value) * 60 + Number(cutoff_input_seconds.value);
      console.log("Set Speed onclick");
      // Check for valid video speeds
      if(to_save != NaN && to_save >= 0) {
        chrome.storage.sync.set({cutoff: to_save}, function() {
          let seconds = Math.floor(to_save - Number(cutoff_input_minutes.value) * 60) >= 10 ? (to_save % 60) : "0" + (to_save % 60);
          cutoff_parag.innerHTML = "Current cutoff: " + Math.floor(to_save / 60) + ":" + seconds;
        });
      } else {
        cutoff_parag.innerHTML = "Not a valid video duration.";
      }
    };
  } else { // Set onclick function for half, normal, and double speed buttons
    buttons[i].onclick = element => {
      let button_text = element.srcElement.textContent || element.srcElement.innerText;
      let speed = Number(button_text.substring(0,button_text.length-1));
      updateSpeed(speed);
    };
  }
}

// Set onclick for enable on livestream checkbox
livestream_checkbox.onclick = () => {
  chrome.storage.sync.set({enable_for_livestream: livestream_checkbox.checked}, () => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      // Message current tab to set enabled for livestream
      chrome.tabs.sendMessage(tabs[0].id, {enable_for_livestream:livestream_checkbox.checked});
    });
  });
}

const links = document.getElementsByTagName("a");
  for (let i=0; i < links.length; i++) {
    const link = links[i];
    if (link.href.substr(0,9) == "chrome://") {
      link.addEventListener("click", function() {
        chrome.tabs.create({ url: this.href });
        return false;
      });
    }
    else if (link.href.substr(12,12) == "buymeacoffee") {
      link.addEventListener("click", function() {
        chrome.tabs.create({ url: this.href });
        return false;
      });
    }
  }

// Set hotkey value text
var commandList = chrome.commands.getAll(commands => {
  for (let i = 0; i < commands.length; i++) {
    let tagText = "td-" + commands[i].name;
    let tdTag = document.getElementById(tagText);
    if (tdTag) tdTag.textContent = commands[i].shortcut || "Not set";
  };
});

// Set the collabsible functionality
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
      content.style.overflow = "hidden";
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      if(this.parentElement.classList.contains("how-to-use-content")) {
        var par = this.parentElement;
        par_max_h = par.style.maxHeight.substring(0,par.style.maxHeight.length-2);
        par.style.maxHeight = (Number(par_max_h) + Number(content.scrollHeight)) + "px";
      }
    }
  });
}