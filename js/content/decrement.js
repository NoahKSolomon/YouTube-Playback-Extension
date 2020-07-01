if(!(document.getElementsByTagName("video")[0] === undefined)) {
	chrome.storage.sync.get('increment', data => {
		let vid = document.getElementsByTagName("video")[0];
	    let cur_speed = vid.playbackRate;
	    vid.playbackRate = cur_speed - data.increment;
		update_ui();
	});
}