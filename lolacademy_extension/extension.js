

function lolacademy_settings(){
	this.refresh_time_interval = 10000;
	this.region = "NA";
	this.minimalAmount = 100;
	this.found = true;
	this.rank = "B";
	this.id = null;
	this.password = null;
	
}


var user_preference = new lolacademy_settings();

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function start_extension(){
	var form_time_interval = document.getElementById("refresh_interval").value;
	if( isNumber(form_time_interval)){
		refresh_time_interval = 1000 * form_time_interval;
	}
	
	var minimalAmount =  document.getElementById("price").value
	var region = document.getElementById("region").value
	if (region == null){
		region = "NA";
	}
	
	user_preference.refresh_time_interval= refresh_time_interval;
	user_preference.region = region;
	user_preference.minimalAmount= minimalAmount;
	user_preference.found = false;
	chrome.storage.local.set({'user_preference':user_preference});
	

	chrome.tabs.getSelected(null, function(tab) {

		chrome.tabs.sendRequest(tab.id, {action: "start", refresh_time_interval: refresh_time_interval, minimalAmount:minimalAmount, region:region}, function(response){
		});
	});
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
		user_preference = result.user_preference;
		document.getElementById("refresh_interval").value =  user_preference.refresh_time_interval;
		document.getElementById("price").value =  user_preference.minimalAmount;
		document.getElementById("region").value =  user_preference.region;
		
	});
	
	var start_btn  = document.getElementById("start_btn");
	var stop_btn  = document.getElementById("stop_btn");
	
	
	
	start_btn.addEventListener("click", function(){
		//alert("start clicked");
		
		chrome.tabs.getAllInWindow(null, function(tabs){
			var createTab = true;
			for (var i = 0; i < tabs.length; i++) {
				if (tabs[i].url == "https://www.lol-academy.net/activeorders.php"){
					createTab = false;
					//chrome.tabs.update(tabs[i].id, {selected: true});
					start_extension();
				}
			}
			if(createTab){
				chrome.tabs.create({url:"https://www.lol-academy.net/activeorders.php", selected:false},function(tab){
					start_extension();
				});
			}
		                    
		});

	}, false);

	stop_btn.addEventListener("click", function(){
		chrome.extension.sendRequest({action: "stop"});
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {action: "stop"}, function(response){
			});
		});
	}, false);
	
	
	/*
	// for alarming which tab 
	var buy_start_btn = document.getElementById("buy_start");
	var buy_stop_btn = document.getElementById("buy_stop");
	var sell_start_btn = document.getElementById("sell_start");
	var sell_stop_btn = document.getElementById("sell_stop");
	
	
	// start refreshing and pass the parameter to contentscript for business logic
	buy_start_btn.addEventListener("click", function(){
		var buy_quantity = document.getElementById("buy_quantity").value;
		var buy_price = document.getElementById("buy_price").value;
		if( !isNumber(buy_quantity) || !isNumber(buy_price)){
			alert("buy quantity or buy price is not a valid number");
			return;
		}
		buy_price = parseFloat(buy_price);
		buy_quantity = parseInt(buy_quantity);
		var form_time_interval = document.getElementById("refresh_interval").value;
		if( isNumber(form_time_interval)){
			refresh_time_interval = 1000 * form_time_interval;
		}
		
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {action: "buy_start", buy_quantity: buy_quantity, buy_price: buy_price,refresh_time_interval: refresh_time_interval});
		});
		
		

	}, false);
	
	
	buy_stop_btn.addEventListener("click", function(){
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {action: "buy_stop"});
		});
	}, false);
	
	
	
	// start refreshing and pass the parameter to contentscript for business logic
	sell_start_btn.addEventListener("click", function(){
		var sell_quantity = document.getElementById("sell_quantity").value;
		var sell_price = document.getElementById("sell_price").value;
		if( !isNumber(sell_quantity) || !isNumber(sell_price)){
			alert("sell quantity or sell price is not a valid number");
			return;
		}
		
		sell_price = parseFloat(sell_price);
		sell_quantity = parseInt(sell_quantity);

		var form_time_interval = document.getElementById("refresh_interval").value;
		if( isNumber(form_time_interval)){
			refresh_time_interval = 1000 * form_time_interval;
		}
		
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {action: "sell_start", sell_quantity: sell_quantity, sell_price: sell_price,refresh_time_interval: refresh_time_interval});
		});
		
	}, false);
	
	
	sell_stop_btn.addEventListener("click", function(){
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {action: "sell_stop"});
		});
		
	}, false);
	
	*/
}







