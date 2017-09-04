chrome.runtime.onMessage.addListener(function(req, sender, reply) {
	if(req.getCookies) {
		chrome.cookies.get({url: "https://scratch.mit.edu", name: "scratchsessionsid"}, sid => {
			reply(sid.value);
		});
		return true;
	} else if (req.setCookies) {
		chrome.cookies.set({url: "https://scratch.mit.edu", name: "scratchsessionsid", domain: ".scratch.mit.edu", value: req.sid}, reply);
		//TODO: set expiry date on cookies
	}
});

let index = 0; // Index of the alt account
function updateMessageCounts() {
	chrome.storage.sync.get(null, function(users) {
		if(Object.keys(users).length === 0) {
			setTimeout(updateMessageCounts, 10e3);
		} else {
			let alt = Object.keys(users)[index];
			let request = new XMLHttpRequest();
			request.open("GET", "https://api.scratch.mit.edu/users/" + alt + "/messages/count");
			request.onreadystatechange = function() {
				if(request.readyState === 4) {
					if(request.status === 200) {
						// User was found because a status of 200 was reported.
						let data = JSON.parse(request.responseText);
						if(data.count !== users[alt].count)	{
							let entry = {};
							entry[alt] = users[alt];
							entry[alt].count = data.count;
							chrome.storage.sync.set(entry);
							chrome.tabs.query({url: "https://scratch.mit.edu/*"}, function(tabs) {
								tabs.forEach(function(tab) {
									console.log(data.count);
									chrome.tabs.sendMessage(tab.id, {name: alt, count: data.count});
								});
							});
						}
					}
					index = (index + 1) % Object.keys(users).length;
					setTimeout(updateMessageCounts, 10e3);
				}
			};
			request.send();
		}
	});
}
updateMessageCounts();