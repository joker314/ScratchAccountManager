chrome.storage.sync.get(null, users => {
	const dropdown = document.querySelector(".dropdown-menu > ul, .dropdown.production");
	if(dropdown) {
		// User is logged in.
		
		const username = dropdown.firstChild.firstChild.href.replace(/.+\/([a-zA-Z0-9_-]+)\/$/, "$1");
		const icon = document.querySelector(".user-icon, .user-info > img").src;
		
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
						entry[username] = {icon, sid};
						
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
			const altUsername = document.createTextNode(user);
			
			altIcon.src = users[user].icon;
			altIcon.className = "avatar user-icon";
			
			altAccount.appendChild(altIcon);
			altAccount.appendChild(altUsername);
			
			altAccount.addEventListener("click", function(e) {
				chrome.runtime.sendMessage({setCookies: true, sid: users[user].sid}, function() {
					location.reload();
				});
			});
		});
		
		dropdown.appendChild(markAsAlt);
	}
});