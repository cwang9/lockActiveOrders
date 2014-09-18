

chrome.extension.onRequest.addListener( function(request, sender, sendResponse) {
	//alert(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
	// change icon
	if (request.action == "found"){
		chrome.tts.speak('Lol academy Order received', {'rate':0.9});
	}
	
	if (request.action == "stop"){
		chrome.tts.speak('automatic searching program stopped', {'rate':0.9});
	}
	
	if (request.action == "start"){
		chrome.tts.speak('automatic searching program started', {'rate':0.9});
	}
}
)
	
	