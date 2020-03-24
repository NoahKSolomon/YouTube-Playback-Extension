let parag = document.getElementById("display_speed");
let set_save_button = document.getElementById("playback_set_save_button");
let input_tag = document.getElementById("playback_input");

// Send message to background script to update the speed of the current tab
function updateSpeed(speed) {
  // Get the active tab in the current window
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    // Send message with new speed
    chrome.tabs.sendMessage(tabs[0].id, {newSpeed: speed});
  });
}

// Display current default speed in popup.html
chrome.storage.sync.get('playback', data => {
  parag.innerHTML = "Current default: " + data.playback + "x";
  input_tag.value = data.playback;
});

// Set the enter key press to activate the 'save' button
input_tag.addEventListener("keyup", function(event) {
  // Key 13 is the enter key
  if(event.keyCode === 13) {
    event.preventDefault();
    set_save_button.click();
  }
});

// Set the onclick method for the save speed button
set_save_button.onclick = element => {
  let to_save = Number(input_tag.value);
  // Check for valid video speeds
  if(to_save != NaN && to_save > 0) {
    chrome.storage.sync.set({playback: to_save}, function() {
      parag.innerHTML = "Current default: " + to_save + "x";
    });
    // Set actual speed in tab
    updateSpeed(to_save);
  } else {
    parag.innerHTML = "Not a valid video speed. Input another speed.";
  }
}

// Set the onclick functions for the half, normal, and double speed buttons
var buttons = document.getElementById('yt_def_sp_body').getElementsByClassName('red');
for(var i = 0; i < buttons.length; i++) {
  if(!(buttons[i].id === 'playback_set_save_button')) {
    buttons[i].onclick = element => {
      let button_text = element.srcElement.textContent || element.srcElement.innerText;
      let speed = Number(button_text.substring(0,button_text.length-1));
      updateSpeed(speed);
    };
  }
}