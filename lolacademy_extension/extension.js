


function lolacademy_settings(){
	this.refresh_time_interval = 0;
	this.region = "NA";
	this.minimalAmount = 2;
	this.maximalAmount = 40;
	this.found = true;
	this.rank = "B";
	this.id = null;
	this.password = null;
	this.siteUser = null;
	this.idSet = false;
	this.pwSet = false;
	this.fromActiveOrderPage = false;
	this.blackList = null;
}



var user_preference ;
var tab_id;
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function start_extension(){
	var form_time_interval = document.getElementById("refresh_interval").value;
	if( isNumber(form_time_interval)){
		refresh_time_interval = 1000 * form_time_interval;
	}
	
	var minimalAmount =  document.getElementById("min_price").value;
	var maximalAmount =  document.getElementById("max_price").value
	var region = document.getElementById("region").value;
	if (region == null){
		region = "NA";
	}
	
	user_preference.refresh_time_interval= refresh_time_interval;
	user_preference.region = region;
	user_preference.minimalAmount= minimalAmount;
	user_preference.maximalAmount= maximalAmount;
	user_preference.found = false;
	chrome.storage.local.set({'user_preference':user_preference});
	
	chrome.tabs.sendRequest(tab_id, {action: "start"}, function(response){});
	/*
	chrome.tabs.getSelected(null, function(tab) {

		chrome.tabs.sendRequest(tab.id, {action: "start"}, function(response){});
	});
	
	*/
}

window.onload = function(){
	/*
	// when switch tab, get buy_info and update the form buy quantity/price
	//chrome.tabs.onSelectionChanged.addListener(function(tadId, changeInfo, tab){
	chrome.tabs.getSelected(null, function(tab){
		chrome.tabs.sendRequest(tab.id, {action: "get_info"});
	});
	//});
	*/
	chrome.storage.local.get('user_preference', function(result){
	

		if (typeof result.user_preference == "undefined"){
			user_preference = new lolacademy_settings();
		}
		else{
			user_preference = result.user_preference;
		}
		document.getElementById("refresh_interval").value =  user_preference.refresh_time_interval;
		document.getElementById("min_price").value =  user_preference.minimalAmount;
		document.getElementById("max_price").value =  user_preference.maximalAmount;
		document.getElementById("region").value =  user_preference.region;
		
		
	});
	
	var start_btn  = document.getElementById("start_btn");
	var stop_btn  = document.getElementById("stop_btn");
	
	
	start_btn.addEventListener("click", function(){
		chrome.tabs.getAllInWindow(null, function(tabs){
			var createTab = true;
			for (var i = 0; i < tabs.length; i++) {
				if (tabs[i].url == "https://www.lol-academy.net/activeorders.php"){
					createTab = false;
					tab_id = tabs[i].id;
					start_extension();
				}
			}
			if(createTab){
				chrome.tabs.create({url:"https://www.lol-academy.net/activeorders.php", selected:false},function(tab){
					tab_id = tab.id;
					start_extension();
				});
			}               
		})
	}, false);

	stop_btn.addEventListener("click", function(){
		chrome.storage.local.get('user_preference', function(result){
				user_preference.found = true;
				chrome.storage.local.set({'user_preference':user_preference});
				chrome.extension.sendRequest({action: "stop"});
				chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.sendRequest(tab.id, {action: "stop"}, function(response){
					});
				});
			});
		
	}, false);
	

}







