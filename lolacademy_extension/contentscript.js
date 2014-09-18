/*
var stockStorage;
var thisStockInfo;

var refresh_time_interval;
var refresh_new_time_interval;
var refresh_reference;
var refresh_toggle;

var buy_toggle;
var sell_toggle;
var buy_quantity;
var buy_price;
var sell_quantity;
var sell_price;
var buy_btn_toggle;
var sell_btn_toggle;
*/
var found;
var refresh_time_interval;
var minimalAmount ;
var region;
var count;
count = 0;
/*





function stockInfo (){
		this.refresh_toggle = false;
		this.refresh_time_interval = 5000;
		this.buy_toggle = false;
		this.sell_toggle = false;
		this.buy_quantity = 0;
		this.buy_price = 0;
		this.sell_quantity = 0;
		this.sell_price = 0;
		this.buy_btn_toggle = "rgb(255,255,255)";
		this.sell_btn_toggle = "rgb(255,255,255)";
}


function check_condition(operation, my_price, my_quantity){
	//console.log("check_condition called");
	var price_table = document.querySelectorAll("#normal>table")[4].rows[1].cells[0].querySelectorAll("table")[6];
	 
	var bid_price = parseFloat(price_table.rows[3].cells[1].innerText);
	var sell_price = parseFloat(price_table.rows[3].cells[3].innerText);
	if( my_quantity == 0 ){
		if( operation == "buy"){
			if( sell_price <= my_price){
				return true;
			}else{
				return false;
			}
		}else{
			if( bid_price >= my_price){
				return true;
			}else{
				return false;
			}
		}
	}

	var bid_quantity;
	var ask_quantity;
	var current_bid_price = bid_price;
	var current_ask_price = sell_price;
	//alert("current_ask_price: " + current_ask_price);
	//alert("my_quantity: " + my_quantity);
	for ( var i = 0 ; i < 10 ; i ++){

		bid_quantity = price_table.rows[5+i].cells[1].innerText;
		bid_quantity = bid_quantity.replace(/,/g,"");
		bid_quantity = bid_quantity.substring(0, bid_quantity.indexOf("("));
		bid_quantity = parseInt(bid_quantity);

		
		ask_quantity = price_table.rows[5+i].cells[3].innerText;
		ask_quantity = ask_quantity.replace(/,/g,"");
		ask_quantity = ask_quantity.substring(0, ask_quantity.indexOf("("));
		ask_quantity = parseInt(ask_quantity);
		//alert("ask_quantity: " + ask_quantity);
		// update my quantity here
		if( operation == "buy" && current_ask_price - 0.001 <= my_price){
			//alert("new q: " + my_quantity + " current_ask_price: " + current_ask_price + " my_price: " + my_price);
			my_quantity -= ask_quantity;
		}else if( operation == "sell" && current_bid_price + 0.001 >= my_price){
			my_quantity -= bid_quantity;
		}
		//console.log("remaining quantity: " + my_quantity);
		//console.log("this bid price: " + current_bid_price);
		//console.log("this quantity: " + bid_quantity);
		// if quantity <=0 , we are dibe
		if( my_quantity <= 0){
			//alert("my_quantity <= 0 , return true");
			return true;
		}
		// update next current prices
		if( current_bid_price > 0.5){
			current_bid_price -= 0.01;
		}else{
			current_bid_price -=0.005;
		}
		
		
		if( current_ask_price >= 0.5){
			current_ask_price += 0.01;
		}else{
			current_ask_price +=0.005;
		}
		//console.log("next: " + current_bid_price + " my price: " + my_price);
		// if update price not meet citeria and quantity still > 0 , then fail!
		if( operation == "buy"){
			if( current_ask_price  - 0.001> my_price && my_quantity > 0 ){
				return false;
			}
		}else{
			if( current_bid_price + 0.001< my_price && my_quantity > 0 ){
				return false;
			}
		}
		
	}

	return false;
}

function play_notification(){
	var hidden_div = document.createElement("div");
	hidden_div.style.display  = "none";
	var audio_tag = document.createElement("audio");
	audio_tag.autoplay = "autoplay";
	audio_tag.id = "notification_sound";
	var source_tag = document.createElement("source");
	source_tag.src = chrome.extension.getURL("testing.mp3");
	audio_tag.appendChild(source_tag);
	hidden_div.appendChild(audio_tag);
	document.body.appendChild(hidden_div);
}

function stop_notification(){
	var audio_tag = document.getElementById("notification_sound");
	if( audio_tag != undefined && audio_tag != null){
		audio_tag.pause();
	}
}

function stop_refresh(){
	refresh_toggle = false;
	stockStorage[stock_code].refresh_toggle= refresh_toggle;
	if( refresh_reference != null){
		clearInterval(refresh_reference);
	}
	// update localStorage
	stockStorage =  JSON.stringify(stockStorage);
	localStorage.setItem("stockStorage", stockStorage);	
	chrome.extension.sendRequest({action: "start"});

}
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
function run_script(){
	//alert("running_script time_interval: "  + refresh_time_interval);
	var s = document.createElement('script');
	s.src = chrome.extension.getURL("testing.js");

	s.onload = function() {
		
		this.parentNode.removeChild(this);
	};
	(document.head||document.documentElement).appendChild(s);
}


var stock_code = document.querySelectorAll("#normal>table")[3].rows[5].cells[0].innerText;
// get variables for this page only

stockStorage = localStorage.getItem("stockStorage");
if( stockStorage == null || stockStorage == undefined || stockStorage == ""){
	stockStorage = new Object();
}else{
	stockStorage = JSON.parse(stockStorage);
}


function checkExistStockInfo(){
	if( stockStorage[stock_code] == null ){
		thisStockInfo = new stockInfo();
		stockStorage[stock_code] = thisStockInfo;
		localStorage.setItem("stockStorage", JSON.stringify(stockStorage));
		stockStorage = localStorage.getItem("stockStorage");
		if( stockStorage == null || stockStorage == undefined){
			stockStorage = new Object();
		}else{
			stockStorage = JSON.parse(stockStorage);
		}
		
	}
	
}
// my stock code


checkExistStockInfo();



refresh_toggle = stockStorage[stock_code].refresh_toggle; // if exist
if( refresh_toggle == null || refresh_toggle == undefined){
	
	refresh_toggle = false; // no
}
if( typeof refresh_toggle != 'boolean'){
	refresh_toggle = (refresh_toggle == "true" ? true : false);
}
refresh_time_interval  =  stockStorage[stock_code].refresh_time_interval;
if( refresh_time_interval == null || refresh_time_interval == undefined){
	refresh_time_interval = 10000;
}
refresh_time_interval = parseInt(refresh_time_interval); // parse to int

// BUY
buy_toggle = stockStorage[stock_code].buy_toggle;

if( buy_toggle == null || buy_toggle == undefined){
	buy_toggle = false;
}

if( typeof buy_toggle != "boolean"){
	buy_toggle = (buy_toggle == "true" ? true : false);
}
// if it is under monitor

//alert("buy_toggle: " + buy_toggle);
if( buy_toggle){
	//alert("really true");
	buy_quantity = stockStorage[stock_code].buy_quantity;
	buy_price = stockStorage[stock_code].buy_price;
	//alert("typeof buy_quantity: " + typeof buy_quantity + " buy_quantity: " + buy_quantity + " price: " + buy_price);
	// if meet
	//alert("buy_quantity: " + buy_quantity + " buy_price: " + buy_price);
	if( check_condition("buy" , buy_price, buy_quantity)){
		play_notification();
	}
}else{
	//alert("not true, typeof buy_toggle: " + typeof buy_toggle);
}
// SELL
sell_toggle = stockStorage[stock_code].sell_toggle;
if( sell_toggle == null || sell_toggle == undefined){
	sell_toggle = false;
}
if( typeof sell_toggle != "boolean"){
	sell_toggle = (sell_toggle == "true" ? true : false);
}
// if it is under monitor
if( sell_toggle){
	
	sell_quantity = stockStorage[stock_code].sell_quantity;
	sell_price = stockStorage[stock_code].sell_price;
	// if meet

	if( check_condition("sell", sell_price, sell_quantity)){
		play_notification();
	}
}


if( refresh_toggle){
//-------------------------------------------------------------------------------------------------------------------------
	window.scroll(100,250);
//-------------------------------------------------------------------------------------------------------------------------	
	//alert("after scroll");
	refresh_reference = setInterval("run_script()", refresh_time_interval);
}
else{
	if( refresh_reference != null){
		clearInterval(refresh_reference);
	}
}

*/


function search_for_matched_order_in_table(bTable){
	blackList = new Array()
	// way to add "bad" orders
	//blackList.push("15546")

	//gets rows of table
	var rowLength = bTable.rows.length;

	//loops through rows    
	for (i = 1; i < rowLength; i++){

	//gets cells of current row
	   var bRow = bTable.rows.item(i).cells;
	   // 5 digit number
	   var orderNumber = bRow.item(0).innerText
	   // NA/OCE/TW/EUW
	   var server = bRow.item(1).innerText
	   // B/S/G/P/D + I/II/III/IV/V + XX LP
	   var rank = bRow.item(2).innerText
	   // numeric number 1+
	   var winsLeft = bRow.item(3).innerText
	   
	   // in USD
	   var moneyPerWin = bRow.item(4).innerText
	   moneyPerWin = moneyPerWin.substring(1, moneyPerWin.indexOf(".")+3)
	   
	   var progress = bRow.item(5).innerText
	   var status = bRow.item(6).innerText
	   status = status.trim()
	   var unlockURL = ""
	   if (status == "Lock account"){ // can lock account
		unlockURL = bRow.item(6).getElementsByTagName("a")[0].href
		//console.log(unlockURL)
		
	   }
	   
	   //console.log( orderNumber + server + rank + winsLeft + moneyPerWin)
	   //console.log("status: " + status)
	  

	   if (server == region  && moneyPerWin >= minimalAmount && status == "Lock account"){
			if (blackList.indexOf(orderNumber) == -1){
				
				//alert("found" + orderNumber + " server: " +server + "moneyPerWin: " + moneyPerWin)
				localStorage['found'] = "TRUE";
				chrome.extension.sendRequest({action: "found"});
				
				window.location.href = unlockURL
			}
	   }
	} 
}

function search_for_order_and_refresh(){
	//alert("refresh_time_interval" +refresh_time_interval);
	console.log("minimalAmount: " +minimalAmount + "region: "+ region);
	var bTable = document.getElementById('boostingOrders').tBodies[0];
    search_for_matched_order_in_table(bTable);
	   
	var tableWrapper = document.getElementById('boostingOrders');

	   
	
	if (localStorage['found'] == "FALSE"){
	
		if (typeof oi != "undefined"){
		//alert("can't find, going to refresh");
		// can't find , sleep , refresh
		//
		var observer = new MutationObserver(function(mutations) {
			var rTable = document.getElementById('boostingOrders').tBodies[0];
			count++;
			console.log("Still searching ... " + count);
			search_for_matched_order_in_table(rTable);
			/*
			  mutations.forEach(function(mutation) {
				console.log(mutation);
				console.log(mutation.target);
				console.log(mutation.type);

			  });    
			 */
		});
		 
		// configuration of the observer:
		var config = { attributes: true, childList: true, characterData: true, subtrue: true };
		console.log("going to start observer");
		// pass in the target node, as well as the observer options
		observer.observe(tableWrapper, config);
		}else{
			setTimeout(function(){location.reload();} , refresh_time_interval);
		}
	}
}


if (localStorage.getItem("found") != null){
	found = localStorage['found'];
	refresh_time_interval = localStorage['refresh_time_interval'];
	minimalAmount = localStorage['minimalAmount'];
	region = localStorage['region'];
		
	if (found == "FALSE"){
		search_for_order_and_refresh();
	}
}

chrome.extension.onRequest.addListener(function(request, sender, callback)
{
	
	/*
	// get most updated stockStorage
	stockStorage = localStorage.getItem("stockStorage");
	if( stockStorage == null || stockStorage == undefined){
		stockStorage = new Object();
	}else{
		stockStorage = JSON.parse(stockStorage);
	}
	*/
	//checkExistStockInfo();
    switch(request.action)
    {
        case "start":
			 //alert("contentscript received something, going to send a stop sign");
			refresh_time_interval = request.refresh_time_interval;
			minimalAmount = request.minimalAmount;
			region = request.region;
			
			localStorage['found']=  "FALSE";
			localStorage['refresh_time_interval'] = refresh_time_interval;
			localStorage['minimalAmount'] = minimalAmount ;
			localStorage['region'] = region;
			chrome.extension.sendRequest({action: "start"});
			search_for_order_and_refresh();
			
			
			/*
			
			refresh_toggle = true;
			refresh_new_time_interval = request.refresh_time_interval;
			//alert("refresh_toggle: " + refresh_toggle + " refresh_new_time_interval: " + refresh_new_time_interval);
			if( isNumber(refresh_new_time_interval)){
				refresh_time_interval = refresh_new_time_interval;
			}
			
			
			stockStorage[stock_code].refresh_toggle = refresh_toggle;
			stockStorage[stock_code].refresh_time_interval = refresh_time_interval;
			// update localStorage
			stockStorage =  JSON.stringify(stockStorage);
			localStorage.setItem("stockStorage", stockStorage);
			
			chrome.extension.sendRequest({action: "stop"});
			refresh_reference = setInterval("run_script()", refresh_time_interval);
			*/
			break;
			
		case "stop":
			//stop_refresh();
			localStorage['found']=  "TRUE";
			break;
			/*
		case "buy_start":
			buy_toggle = true;
			stockStorage[stock_code].buy_toggle = buy_toggle;
			buy_price = request.buy_price;
			buy_quantity = request.buy_quantity;
			stockStorage[stock_code].buy_price = buy_price;
			stockStorage[stock_code].buy_quantity = buy_quantity;
	
			refresh_toggle = true;
			refresh_new_time_interval = request.refresh_time_interval;
			//alert("refresh_toggle: " + refresh_toggle + " refresh_new_time_interval: " + refresh_new_time_interval);
			if( isNumber(refresh_new_time_interval)){
				refresh_time_interval = refresh_new_time_interval;
			}
			//update local storage
			
			stockStorage[stock_code].refresh_toggle = refresh_toggle;
			stockStorage[stock_code].refresh_time_interval = refresh_time_interval;
	
			
			buy_btn_toggle = stockStorage[stock_code].buy_btn_toggle;
			//alert("buy_btn_toggle: " + buy_btn_toggle);
			if( buy_btn_toggle == undefined || buy_btn_toggle == null){
				buy_btn_toggle = "rgb(255,255,255)";
			}
			if( buy_btn_toggle == "rgb(255,255,255)"){
				buy_btn_toggle = "rgb(0,255,0)";
			}else if(buy_btn_toggle == "rgb(0,255,0)"){
				buy_btn_toggle = "rgb(255,0,0)";
			}else if(buy_btn_toggle == "rgb(255,0,0)"){
				buy_btn_toggle = "rgb(0,255,0)";
			}
			stockStorage[stock_code].buy_btn_toggle = buy_btn_toggle;
			
			
			// update localStorage
			stockStorage =  JSON.stringify(stockStorage);
			//alert("stockStorage: " + stockStorage);
			localStorage.setItem("stockStorage", stockStorage);
			//alert("contentscript going to send buy_start to background.js");
			chrome.extension.sendRequest({action: "buy_start", buy_btn_toggle:buy_btn_toggle});
			refresh_reference = setInterval("run_script()", refresh_time_interval);
			break;
		case "buy_stop":
			buy_toggle = false;
			stockStorage[stock_code].buy_toggle = buy_toggle;
			buy_btn_toggle = "rgb(255,255,255)";
			stockStorage[stock_code].buy_btn_toggle = buy_btn_toggle;
			// update localStorage
			stockStorage =  JSON.stringify(stockStorage);
			localStorage.setItem("stockStorage", stockStorage);
			chrome.extension.sendRequest({action: "buy_end"});
			stop_notification();
			
			break;
			
		case "sell_start":
			sell_toggle = true;
			stockStorage[stock_code].sell_toggle = sell_toggle;
			sell_price = request.sell_price;
			sell_quantity = request.sell_quantity;
			stockStorage[stock_code].sell_price = sell_price;
			stockStorage[stock_code].sell_quantity = sell_quantity;
			refresh_toggle = true;
			refresh_new_time_interval = request.refresh_time_interval;
			//alert("refresh_toggle: " + refresh_toggle + " refresh_new_time_interval: " + refresh_new_time_interval);
			if( isNumber(refresh_new_time_interval)){
				refresh_time_interval = refresh_new_time_interval;
			}
			//update local storage
			stockStorage[stock_code].refresh_toggle = refresh_toggle;
			stockStorage[stock_code].refresh_time_interval = refresh_time_interval;
			sell_btn_toggle = stockStorage[stock_code].sell_btn_toggle;
			if( sell_btn_toggle == undefined || sell_btn_toggle == null){
				sell_btn_toggle = "rgb(255,255,255)";
			}
			if( sell_btn_toggle == "rgb(255,255,255)"){
				sell_btn_toggle = "rgb(0,255,0)";
			}else if(sell_btn_toggle == "rgb(0,255,0)"){
				sell_btn_toggle = "rgb(255,0,0)";
			}else if(sell_btn_toggle == "rgb(255,0,0)"){
				sell_btn_toggle = "rgb(0,255,0)";
			}
			stockStorage[stock_code].sell_btn_toggle = sell_btn_toggle;
			
			// update localStorage
			stockStorage =  JSON.stringify(stockStorage);
			localStorage.setItem("stockStorage", stockStorage);
			chrome.extension.sendRequest({action: "sell_start", sell_btn_toggle:sell_btn_toggle});
			refresh_reference = setInterval("run_script()", refresh_time_interval);
			break;
		case "sell_stop":
			sell_toggle = false;
			stockStorage[stock_code].sell_toggle = sell_toggle;
			sell_btn_toggle = "rgb(255,255,255)";
			stockStorage[stock_code].sell_btn_toggle = sell_btn_toggle;
			stop_notification();
			// update localStorage
			stockStorage =  JSON.stringify(stockStorage);
			localStorage.setItem("stockStorage", stockStorage);
			chrome.extension.sendRequest({action: "sell_end"});
			break;
		case "get_info":
		
		
			refresh_toggle = stockStorage[stock_code].refresh_toggle;
			if( refresh_toggle == null || refresh_toggle == undefined){
				refresh_toggle = false;
			}
			buy_toggle =stockStorage[stock_code].buy_toggle;
			if( buy_toggle == null || buy_toggle == undefined){
				buy_toggle = false;
			}
			if( typeof buy_toggle != 'boolean'){
				buy_toggle = (buy_toggle == "true" ? true : false);
			}
			buy_quantity = stockStorage[stock_code].buy_quantity;
			if( buy_quantity == null || buy_quantity == undefined){
				buy_quantity = 0;
			}
			buy_price = stockStorage[stock_code].buy_price;
			if( buy_price == null || buy_price == undefined){
				buy_price = 0;
			}
			sell_toggle = stockStorage[stock_code].sell_toggle;
			if( sell_toggle == null || sell_toggle == undefined){
				sell_toggle = false;
			}
			if( typeof sell_toggle != 'boolean'){
				sell_toggle = (sell_toggle == "true" ? true : false);
			}
			sell_quantity = stockStorage[stock_code].sell_quantity;
			if( sell_quantity == null || sell_quantity == undefined){
				sell_quantity = 0;
			}
			sell_price = stockStorage[stock_code].sell_price;
			if( sell_price == null || sell_price == undefined){
				sell_price = 0;
			}
			refresh_time_interval  = stockStorage[stock_code].refresh_time_interval;
			if( refresh_time_interval == null || refresh_time_interval == undefined){
				refresh_time_interval = 10000;
			}
			refresh_time_interval = parseInt(refresh_time_interval); // parse to int

			buy_btn_toggle = stockStorage[stock_code].buy_btn_toggle;
			if( buy_btn_toggle == undefined || buy_btn_toggle == null){
				buy_btn_toggle = "rgb(255,255,255)";
			}
			
			sell_btn_toggle = stockStorage[stock_code].sell_btn_toggle;
			if( sell_btn_toggle == undefined || sell_btn_toggle == null){
				sell_btn_toggle = "rgb(255,255,255)";
			}
			chrome.extension.sendRequest({action: "info",refresh_toggle: refresh_toggle,sell_btn_toggle:sell_btn_toggle,buy_btn_toggle: buy_btn_toggle,refresh_time_interval: refresh_time_interval,buy_toggle: buy_toggle, buy_quantity: buy_quantity, buy_price: buy_price,sell_toggle: sell_toggle, sell_quantity: sell_quantity, sell_price: sell_price});
			
			break;
			*/
			
    }
});


