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
}

var user_preference = new lolacademy_settings();

function search_for_matched_order_in_table(bTable){
	blackList = new Array()
	console.log("search_for_matched_order_in_table...");
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
	   
	   //console.log("table data: " + orderNumber + server + rank + winsLeft + moneyPerWin)
	   //console.log("status: " + status)
	  //console.log(user_preference);
		
	   if (server == user_preference.region  && parseFloat(moneyPerWin) >= parseFloat(user_preference.minimalAmount) && status == "Lock account"){
			if (blackList.indexOf(orderNumber) == -1){
				//console.log("Order found");
				alert( moneyPerWin +  "," + user_preference.minimalAmount);
				alert(moneyPerWin >= user_preference.minimalAmount);
				alert("found" + orderNumber + " server: " +server + "moneyPerWin: " + moneyPerWin)
				user_preference.found = true;
				chrome.storage.local.set({'user_preference': user_preference});
				chrome.extension.sendRequest({action: "found"});
				
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
			setTimeout(function(){location.reload();} , user_preference.refresh_time_interval);
		}
	}
}


chrome.storage.local.get('user_preference', function(result){
	user_preference = result.user_preference;
	if(!user_preference.found){
	search_for_order_and_refresh();
}
	if (document.cookie.indexOf("user=") < 0){
		alert("please logon lolacademy");
	}

});


/*
if (localStorage.getItem("found") != null){
	found = localStorage['found'];
	refresh_time_interval = localStorage['refresh_time_interval'];
	minimalAmount = localStorage['minimalAmount'];
	region = localStorage['region'];
		
	if (found == "FALSE"){
		search_for_order_and_refresh();
	}
}

console.log("Testing chrome storage");
chrome.storage.local.get('refresh_time_interval',function(result){
    console.log('chrome refresh_time_interval',result);
	console.log(result);
    //console output = myVariableKeyName {}
});
*/
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
			 /*
			refresh_time_interval = request.refresh_time_interval;
			minimalAmount = request.minimalAmount;
			region = request.region;
			
			localStorage['found']=  "FALSE";
			localStorage['refresh_time_interval'] = refresh_time_interval;
			localStorage['minimalAmount'] = minimalAmount ;
			localStorage['region'] = region;
			*/
			chrome.extension.sendRequest({action: "start"});
			chrome.storage.local.get('user_preference', function(result){
				user_preference = result.user_preference;
				if(!user_preference.found){
				search_for_order_and_refresh();
			}

			});
			
			
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

			
    }
});


