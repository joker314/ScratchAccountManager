chrome.runtime.onMessage.addListener(function(req, res, reply) {
	if(req.getCookies) {
		chrome.cookies.get({url: "https://scratch.mit.edu", name: "scratchsessionsid"}, sid => {
			reply(sid.value);
		});
		return true;
	} else if (req.setCookies) {
		chrome.cookies.set({url: "https://scratch.mit.edu", name: "scratchsessionsid", value: req.sid}, reply);
		//TODO: set expiry date on cookies
	}
});