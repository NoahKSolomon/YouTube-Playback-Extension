let parag = document.getElementById("display_speed");
let set_save_button = document.getElementById("playback_set_save_button");
let input_tag = document.getElementById("playback_input");

// Display current default speed in popup.html
chrome.storage.sync.get('playback', function(data) {
    parag.innerHTML = "Current default: " + data.playback + "x";
    input_tag.value = data.playback;
});

// Set the onclick method for the half speed button
set_save_button.onclick = function(element) {
  let to_save = Number(input_tag.value);
  // Check for valid video speeds
  if(to_save != NaN && to_save > 0) {
    chrome.storage.sync.set({playback: to_save}, function() {
      parag.innerHTML = "Current default: " + to_save + "x";
    });
    // Set actual speed in tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.storage.sync.get('playback', function(data) {
          let set_to = data.playback_speed;
          chrome.tabs.executeScript(
              tabs[0].id,
              {code: 'document.getElementsByTagName("video")[0].playbackRate = ' + data.playback + ';'}
          );
      });
    });
  } else {
    parag.innerHTML = "Not a valid video speed. Input another speed.";
  }
}

// Set the enter key press to activate the 'save' button
input_tag.addEventListener("keyup", function(event) {
  // Key 13 is the enter key
  if(event.keyCode === 13) {
    event.preventDefault();
    set_save_button.click();
  }
});

// Set the onclick method for the half speed button
document.getElementById("half_speed_button").onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {code: 'document.getElementsByTagName("video")[0].playbackRate = 0.5;'}
    );
  });
}

// Set the onclick method for the normal speed button
document.getElementById("normal_speed_button").onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {code: 'document.getElementsByTagName("video")[0].playbackRate = 1.0;'}
    );
  });
}

// Set the onclick method for the double speed button
document.getElementById("double_speed_button").onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {code: 'document.getElementsByTagName("video")[0].playbackRate = 2.0;'}
    );
  });
}