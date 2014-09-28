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

var count;
count = 0;

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

function search_for_matched_order_in_table(bTable){
	blackList = new Array()
	//console.log("search_for_matched_order_in_table...");
	// way to add "bad" orders
	//blackList.push("15546")

	//gets rows of table
	var rowLength = bTable.rows.length;
	
	//loops through rows    
	for (i = 0; i < rowLength; i++){

	//gets cells of current row
	   var bRow = bTable.rows.item(i).cells;
	   // 5 digit number
	   var orderNumber = bRow.item(0).innerText
	   if (orderNumber.length != 5){
			continue;
	   }
	   // NA/OCE/TW/EUW
	   var server = bRow.item(1).innerText;
	   // B/S/G/P/D + I/II/III/IV/V + XX LP
	   var rank = bRow.item(2).innerText;
	   
	   user_preference.rank = rank.substring(0,0);
	   // numeric number 1+
	   var winsLeft = bRow.item(3).innerText;
	   
	   // in USD
	   var moneyPerWin = bRow.item(4).innerText;
	   moneyPerWin = moneyPerWin.substring(1, moneyPerWin.indexOf(".")+3);
	   
	   var progress = bRow.item(5).innerText;
	   var status = bRow.item(6).innerText;
	   status = status.trim();
	   var unlockURL = "";
	   if (status == "Lock account"){ // can lock account
			unlockURL = bRow.item(6).getElementsByTagName("a")[0].href;
		//console.log(unlockURL)
		
	   }
	   
	   //console.log("table data: " + orderNumber + server + rank + winsLeft + moneyPerWin)
	   //console.log("status: " + status)
	  //console.log(user_preference);
		
	   if (server == user_preference.region  && parseFloat(moneyPerWin) >= parseFloat(user_preference.minimalAmount) && status == "Lock account"){
			if (blackList.indexOf(orderNumber) == -1){
				//console.log("Order found");
				user_preference.found = true;
				chrome.storage.local.set({'user_preference': user_preference});
				
				
				window.location.href = unlockURL
			}
	   }
	} 
}

function search_for_order_and_refresh(){
	//alert("refresh_time_interval" +refresh_time_interval);
	var bTable = document.getElementById('boostingOrders').tBodies[0];
    search_for_matched_order_in_table(bTable);
	   
	var tableWrapper = document.getElementById('boostingOrders');
	
	if (!user_preference.found){
		if (user_preference.refresh_time_interval == 0){
			var observer = new MutationObserver(function(mutations) {
				var rTable = document.getElementById('boostingOrders').tBodies[0];
				count++;
				console.log("Still searching ... " + count);
				search_for_matched_order_in_table(rTable);
			});
			 
			// configuration of the observer:
			var config = { attributes: true, childList: true, characterData: true, subtrue: true };
			console.log("going to start observer");
			// pass in the target node, as well as the observer options
			observer.observe(tableWrapper, config);
		}else{
			setTimeout(function(){location.reload();} , user_preference.refresh_time_interval);
		}
	}
}

var currentGame;
var nextElement;
chrome.storage.local.get('user_preference', function(result){
	user_preference = result.user_preference;
	
	if (document.URL.indexOf("activeorders.php") > -1 ){
		if(!user_preference.found){
			chrome.extension.sendRequest({action: "start"});
			search_for_order_and_refresh();
		}
		if (document.cookie.indexOf("user=") < 0){
			alert("please logon lolacademy");
		}
	}
	else if ( document.URL.indexOf("order.php?id=") > -1 ){
		currentGame = document.getElementById("currentGame");
		nextElement = currentGame.nextSibling;
		while( (!user_preference.id || !user_preference.password) && nextElement!== null){
			if (typeof nextElement.innerText == "undefined" &&  nextElement.textContent.trim().indexOf("ID:") > -1 ){
				console.log( nextElement.textContent.trim().substring(4));
				user_preference.id  = nextElement.textContent.trim().substring(4);
			}
			
			if (typeof nextElement.innerText == "undefined"  && nextElement.textContent.trim().indexOf("PW:") > -1 ){
				console.log( nextElement.textContent.trim().substring(4));
				user_preference.password  = nextElement.textContent.trim().substring(4);
			}
			nextElement = nextElement.nextSibling;
		}
		chrome.extension.sendRequest({action: "found", user_preference: user_preference});
	}
	

});



chrome.extension.onRequest.addListener(function(request, sender, callback)
{
	
    switch(request.action)
    {
        case "start":

			chrome.extension.sendRequest({action: "start"});
			chrome.storage.local.get('user_preference', function(result){
				user_preference = result.user_preference;
				if (document.URL.indexOf("activeorders.php") > -1 ){
					if(!user_preference.found){
						search_for_order_and_refresh();
					}
				}

			});
			break;
		case "stop":
			chrome.storage.local.get('user_preference', function(result){
				user_preference.found = true;
				chrome.storage.local.set({'user_preference':user_preference});
				chrome.extension.sendRequest({action: "stop"});
			});
			break;
    }
});


