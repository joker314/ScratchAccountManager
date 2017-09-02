chrome.storage.sync.get(null, users => {
	const dropdown = document.querySelector(".dropdown-menu > ul, .dropdown.production");
	if(dropdown) {
		// User is logged in.
		
		const username = dropdown.firstChild.firstChild.href.replace(/.+\/([a-zA-Z0-9_-]+)\/$/, "$1");
		const icon = document.querySelector(".user-icon, .user-info > img").src;
		const truncated = document.querySelector(".user-icon, .user-info > img").nextSibling.textContent;
		
		const markAsAlt = document.createElement("LI");
		
		let amIAnAlt = Object.keys(users).includes(username);
		
		markAsAlt.appendChild(
			document.createTextNode(amIAnAlt ? "Unmark as alt" : "Mark as alt")
		);
		
		markAsAlt.addEventListener("click", function(e){
			if(amIAnAlt) {
				markAsAlt.firstChild.textContent = "Mark as alt";
				
				chrome.storage.sync.remove(username);
			} else {
				markAsAlt.firstChild.textContent = "Unmark as alt";
				
				chrome.runtime.sendMessage({getCookies: true}, function(sid) {
						let entry = {};
						entry[username] = {icon, sid, truncated, count: 0};
						
						chrome.storage.sync.set(entry);
						
						Object.assign(users, entry);
				});
			}
			amIAnAlt = !amIAnAlt;
		});
		
		Object.keys(users).filter(user => user !== username).forEach(function(user) {
			const altAccount = document.createElement("A");
			const outer = document.createElement("LI");
			
			outer.appendChild(altAccount);
			
			dropdown.appendChild(outer);
			
			const altIcon = document.createElement("IMG");
			const altUsername = document.createTextNode(users[user].truncated); // Use truncated username
			const altMessages = document.createElement("SPAN"); // Message count
			
			altMessages.className = "msg-count";
			altMessages.id = "alt-account-user-" + user;
			
			if(users[user].count) {
				altMessages.textContent = users[user].count;
				altMessages.className = "msg-count visible";
			} else {
				altMessages.className = "msg-count";
			}
			
			altIcon.src = users[user].icon;
			altIcon.className = "avatar user-icon";
			
			altAccount.appendChild(altIcon);
			altAccount.appendChild(altUsername);
			altAccount.appendChild(altMessages);
			
			altAccount.addEventListener("click", function(e) {
				chrome.runtime.sendMessage({setCookies: true, sid: users[user].sid}, function() {
					if(e.path[0] === altMessages && location.pathname !== "/messages/") {
						location.href = "https://scratch.mit.edu/messages/";
					} else {
						location.reload();
					}
				});
			});
		});
		
		dropdown.appendChild(markAsAlt);
		
		chrome.runtime.onMessage.addListener(function(req) {		
			document.querySelector("#alt-account-user-" + req.name).textContent = req.count;
			document.querySelector("#alt-account-user-" + req.name).className = req.count ? "msg-count visible" : "msg-count";
		});
	}
});