let save_button = document.getElementById("playback_save_button");
let input_tag = document.getElementById("playback_input");
let parag = document.getElementById("display_speed");

// Set input tag text
chrome.storage.sync.get('playback', function(data) {
  input_tag.value = data.playback;
})

// Display current default speed in popup.html
chrome.storage.sync.get('playback', function(data) {
  parag.innerHTML = "Current default: " + data.playback;
  input_tag.value = data.playback;
});

// Set the onclick method for the half speed button
save_button.onclick = function(element) {
  let to_save = Number(input_tag.value);
  // Check for valid video speeds
  if(to_save != NaN && to_save > 0) {
    chrome.storage.sync.set({playback: to_save}, function() {
      parag.innerHTML = "Current default: " + to_save + "x";
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
    save_button.click();
  }
});