chrome.runtime.onMessage.addListener(function(req, res, reply) {
	if(req === "GET COOKIES") {
		chrome.cookies.get({url: "https://scratch.mit.edu", name: "scratchsessionsid"}, sid => {
			chrome.cookies.get({url: "https://scratch.mit.edu", name: "scratchcsrftoken"}, csrf => {
				reply(sid, csrf);
			});
		});
	}
});