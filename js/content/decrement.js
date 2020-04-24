if(!(document.getElementsByTagName("video")[0] === undefined)) {
	chrome.storage.sync.get('increment', data => {
		let vid = document.getElementsByTagName("video")[0];
	    let cur_speed = vid.playbackRate;
	    vid.playbackRate = cur_speed - data.increment;//(cur_speed - data.increment < 0) ? 0 : cur_speed - data.increment < 0;
	});
}