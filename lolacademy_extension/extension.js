var refresh_time_interval = 10000;




function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
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
	
	
	var start_btn  = document.getElementById("start_btn");
	var stop_btn  = document.getElementById("stop_btn");
	
	
	
	start_btn.addEventListener("click", function(){
		//alert("start clicked");
		var form_time_interval = document.getElementById("refresh_interval").value;
		if( isNumber(form_time_interval)){
			refresh_time_interval = 1000 * form_time_interval;
		}
		var minimalAmount =  document.getElementById("price").value
		var region = document.getElementById("region").value
		if (region == null){
			region = "NA";
		}
		
		chrome.tabs.getSelected(null, function(tab) {

			chrome.tabs.sendRequest(tab.id, {action: "start", refresh_time_interval: refresh_time_interval, minimalAmount:minimalAmount, region:region}, function(response){
			});
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







