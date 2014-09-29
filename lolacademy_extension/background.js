
var user_preference; 
chrome.extension.onRequest.addListener( function(request, sender, sendResponse) {
	
	//alert(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
	// change icon
	if (request.action == "found"){
	
		user_preference = request.user_preference;
		chrome.notifications.create(
		  'lolacademy',{   
			  type: 'image', 
			  iconUrl: user_preference.rank + '.png',
			  title: 'lolacademy order received', 
			  message: 'ID: ' + user_preference.id  +"\n" + "PW: " + user_preference.password,
			  imageUrl: "lolacademy.png", 
			  priority: 0},
		  function() { /* Error checking goes here */} 

		); 
			
		chrome.notifications.onClosed.addListener(function(){
		});
		chrome.notifications.onClicked.addListener(function(){
		});
		chrome.tts.speak( user_preference.siteUser + ', order received', {'rate':0.9});
		
	}
	
	if (request.action == "stop"){
		
		
		chrome.tts.speak('automatic searching program stopped', {'rate':0.9});
	}
	
	if (request.action == "start"){
		
		chrome.tts.speak('automatic searching program started', {'rate':0.9});
	}
}
)
	
	