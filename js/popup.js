let speed_parag = document.getElementById("display_speed");
let inc_parag = document.getElementById("display_inc");
let set_save_button = document.getElementById("playback_set_save_button");
let speed_input_tag = document.getElementById("playback_input");
let inc_input_tag = document.getElementById("inc_input");

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
chrome.storage.sync.get(['playback', 'increment'], data => {
  speed_parag.innerHTML = "Current default: " + data.playback + "x";
  inc_parag.innerHTML = "Current increment: " + data.increment + "x";
  speed_input_tag.value = data.playback;
  inc_input_tag.value = data.increment;
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

// Set the onclick functions for buttons
var buttons = document.getElementById('yt_def_sp_body').getElementsByClassName('red');
for(var i = 0; i < buttons.length; i++) {
  if(buttons[i].id === 'playback_set_save_button') { // Set the onclick method for the save speed button
    buttons[i].onclick = element => {
        let to_save = Number(speed_input_tag.value);
        // Set actual speed in tab
        updateSpeed(to_save, true);
      
    };
  } else if (buttons[i].id === 'inc_set_save_button') { // Set onclick functions for set increment button
    buttons[i].onclick = element => {
      let to_save = Number(inc_input_tag.value);
      // Check for valid video speeds
      if(to_save != NaN && to_save > 0) {
        chrome.storage.sync.set({increment: to_save}, function() {
          inc_parag.innerHTML = "Current increment: " + to_save + "x";
        });
      } else {
        inc_parag.innerHTML = "Not a valid video speed. Input another speed.";
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
      //content.style.maxHeight = "none";
      //content.style.overflow = "auto";
    }
  });
}