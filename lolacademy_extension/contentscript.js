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
var countdownTimer;
count = 0;

function lolacademy_settings(){
	this.refresh_time_interval = 10000;
	this.region = "NA";
	this.minimalAmount = null;
	this.maximalAmount = null;
	this.found = true;
	this.fromActiveOrderPage = false;
	this.rank = "B";
	this.id = null;
	this.password = null;
	this.siteUser = null;
	this.idSet = false;
	this.pwSet = false;
	this.blackList = null;
	this.countdown_interval = 0;
	
}

var user_preference = new lolacademy_settings();

function search_for_matched_order_in_table(bTable){

	//console.log("search_for_matched_order_in_table...");
	// way to add "bad" orders


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
	   //console.log("orderNumber: " + orderNumber);
	   // NA/OCE/TW/EUW
	   var server = bRow.item(1).innerText;
	   // B/S/G/P/D + I/II/III/IV/V + XX LP
	   var rank = bRow.item(2).innerText;
	   
	   user_preference.rank = rank.substring(0,1);
	  
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
		
	   if ( user_preference.region.indexOf(server) >=0  && parseFloat(moneyPerWin) >= parseFloat(user_preference.minimalAmount)  && parseFloat(moneyPerWin) <= parseFloat(user_preference.maximalAmount)&& status == "Lock account"){
			if (!user_preference.blackList){
				user_preference.blackList = new Array()
			}
			
			if (user_preference.blackList.indexOf(orderNumber) == -1){
				//console.log("Order found");
				user_preference.found = true;
				user_preference.fromActiveOrderPage = true;
				//alert("rank" + user_preference.rank);
				//alert(user_preference);
				chrome.storage.local.set({'user_preference': user_preference});
				
				window.location.href = unlockURL;
			}else{
				console.log("Blocked by blacklist");
			}
	   }
	} 
}

// Larry call it / add it to menu later
function clear_black_list(){
	user_preference.blackList = null;
	chrome.storage.local.set({'user_preference': user_preference});
	console.log(user_preference.blackList);
}

function reset(){
	user_preference = null;
	chrome.storage.local.set({'user_preference': user_preference});
	
}

function add_timer(){
	var newDiv  = document.createElement("div");
	newDiv.innerHTML = '<div class="clock flip-clock-wrapper" style="display:none;margin:2em;"><span class="flip-clock-divider hours"><span class="flip-clock-label">Hours</span></span><ul class="flip "><li class="flip-clock-before"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">9</div></div><div class="down"><div class="shadow"></div><div class="inn">9</div></div></a></li><li class="flip-clock-active"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">0</div></div><div class="down"><div class="shadow"></div><div class="inn">0</div></div></a></li></ul><ul class="flip "><li class="flip-clock-before"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">9</div></div><div class="down"><div class="shadow"></div><div class="inn">9</div></div></a></li><li class="flip-clock-active"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">0</div></div><div class="down"><div class="shadow"></div><div class="inn">0</div></div></a></li></ul><span class="flip-clock-divider minutes"><span class="flip-clock-label">Minutes</span><span class="flip-clock-dot top"></span><span class="flip-clock-dot bottom"></span></span><ul class="flip "><li class="flip-clock-before"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">9</div></div><div class="down"><div class="shadow"></div><div class="inn">9</div></div></a></li><li class="flip-clock-active"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">0</div></div><div class="down"><div class="shadow"></div><div class="inn">0</div></div></a></li></ul><ul class="flip "><li class="flip-clock-before"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">9</div></div><div class="down"><div class="shadow"></div><div class="inn">9</div></div></a></li><li class="flip-clock-active"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">0</div></div><div class="down"><div class="shadow"></div><div class="inn">0</div></div></a></li></ul><span class="flip-clock-divider seconds"><span class="flip-clock-label">Seconds</span><span class="flip-clock-dot top"></span><span class="flip-clock-dot bottom"></span></span><ul class="flip "><li class="flip-clock-before"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">9</div></div><div class="down"><div class="shadow"></div><div class="inn">9</div></div></a></li><li class="flip-clock-active"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">0</div></div><div class="down"><div class="shadow"></div><div class="inn">0</div></div></a></li></ul><ul class="flip  play"><li class="flip-clock-before"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">6</div></div><div class="down"><div class="shadow"></div><div class="inn">6</div></div></a></li><li class="flip-clock-active"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">7</div></div><div class="down"><div class="shadow"></div><div class="inn">7</div></div></a></li></ul></div>';
	newDiv.style.position = "absolute";
	newDiv.style.top = "300px";
	var b = document.body
	b.appendChild(newDiv);
	
}

function start_timer(){
	if( user_preference.countdown_interval != 0){
		var clock;
		clock = $('.clock')[0];
		clock.style.display = "block";
		clock = $('.clock').FlipClock(user_preference.countdown_interval,{
			clockFace: 'HourlyCounter',
			countdown: true
		});
	}else{
		var clock;
		clock = $('.clock')[0];
		clock.style.display = "none";
	}
}

function stop_timer(){
	var clock;
		clock = $('.clock')[0];
		clock.style.display = "none";
}
// add and remove
function add_black_list(){
	var tableWrapper = document.getElementById('boostingOrders');
	var tblHeadObj = tableWrapper.tHead;
	
	if (tblHeadObj.innerText.indexOf("Block") >= 0){
		return;
	}
	
	var newTH = document.createElement('th');
	tblHeadObj.rows[0].appendChild(newTH);
	newTH.innerHTML = 'Block';
	
		
	var tblBodyObj = tableWrapper.tBodies[0];
	for (var i=0; i<tblBodyObj.rows.length; i++) {


		var newCell = tblBodyObj.rows[i].insertCell(-1);
		orderNumber = tblBodyObj.rows[i].cells.item(0).innerText;
		(function(orderNumber){
			if (!user_preference.blackList){
				user_preference.blackList = new Array()
			}
			
			a = document.createElement('a');
			
			a.style = "margin-bottom: -15px; border-radius: 10px";
			if (user_preference.blackList.indexOf(orderNumber) == -1){
				a.className = "small flat warning icon-ban-circle button";
				a.innerHTML = "&nbsp;Block account";
			}else{
				a.className = "small flat warning icon-ok-circle button";
				a.innerHTML = "&nbsp;Unblock account";
			}
			newCell.appendChild(a);

			//newCell.innerHTML = '<a class="small flat warning button" style="margin-bottom: -15px; border-radius: 0px;">Block account</a>';
			newCell.addEventListener('click', function(){
				if (!user_preference.blackList){
					user_preference.blackList = new Array()
				}
				//console.log(this);
				//console.log(newCell);
				var content = this.getElementsByTagName("a")[0];
				if (content.innerHTML.trim() == "&nbsp;Block account"){
					user_preference.blackList.push(orderNumber);
					content.className = "small flat warning icon-ok-circle button";
					//alert("Blocked this account for auto-locking");
					content.innerHTML = "&nbsp;Unblock account";
				}else{
					user_preference.blackList.pop(orderNumber);
					content.className ="small flat warning icon-ban-circle button";
					//alert("Unblocked this account for auto-locking");
					content.innerHTML = "&nbsp;Block account";
				
				}
				chrome.storage.local.set({'user_preference': user_preference});
				
				//console.log(user_preference.blackList);
				//tableWrapper.insertRow(0);
			});
			
		})(orderNumber);
	}
}


function look_for_table_update(){
	

	//alert("refresh_time_interval" +refresh_time_interval);
	var bTable = document.getElementById('boostingOrders').tBodies[0];
    
	   
	var tableWrapper = document.getElementById('boostingOrders');
	
	var observer = new MutationObserver(function(mutations) {
		add_black_list();
	});
	// configuration of the observer:
	var config = { attributes: true, childList: true, characterData: true, subtrue: true };
	//console.log("going to start observer");
	// pass in the target node, as well as the observer options
	observer.observe(tableWrapper, config);
	


}

// added by larry , the timer feature

function search_for_order_and_refresh(){
	stop_timer();
	chrome.extension.sendRequest({action: "start"});
	//alert("refresh_time_interval" +refresh_time_interval);
	var bTable = document.getElementById('boostingOrders').tBodies[0];
    search_for_matched_order_in_table(bTable);
	   
	var tableWrapper = document.getElementById('boostingOrders');
	
	if (!user_preference.found){
		if (user_preference.refresh_time_interval == 0){
			var observer = new MutationObserver(function(mutations) {
				chrome.storage.local.get('user_preference', function(result){
					user_preference = result.user_preference;
					if (user_preference.found){
						console.log("going to disconnect observer");
						observer.disconnect();
					}else{
						var rTable = document.getElementById('boostingOrders').tBodies[0];
						count++;
						console.log("Still searching ... " + count);
						search_for_matched_order_in_table(rTable);
					}
				});
				
			});
			 
			// configuration of the observer:
			var config = { attributes: true, childList: true, characterData: true, subtrue: true };
			console.log("going to start observer");
			// pass in the target node, as well as the observer options
			observer.observe(tableWrapper, config);
		}else{
			countdownTimer = setTimeout(function(){location.reload();} , user_preference.refresh_time_interval);
		}
	}
}

// main procedure here
var currentGame;
var nextElement;
chrome.storage.local.get('user_preference', function(result){

	if (chrome.runtime.lastError){
		user_preference = new lolacademy_settings();
	}
	//console.log(result);
	//console.log(result.user_preference);
	
	var input = "";
	document.body.addEventListener('keypress',function(ev){
		input += String.fromCharCode(ev.keyCode);
		//console.log(input);
		if(input == "clearblacklist"){
			clear_black_list();
			input = "";
		}
		if ( input == "reset"){
			reset();
			input = "";
		}
	});
	if (typeof result.user_preference != "undefined"){
		user_preference = result.user_preference;
	}else{
		user_preference = new lolacademy_settings();
	}
	if (typeof user_preference != "undefined"){
		
		if (document.URL.indexOf("activeorders.php") > -1 ){
			add_black_list();
			add_timer();
			
			look_for_table_update();
			if (document.cookie.indexOf("user=") < 0){
				alert("please logon lolacademy please");
			}else{
				//console.log("Cookies: " + document.cookie);
				var siteUser = document.cookie.substring(document.cookie.indexOf("user=")+5,document.cookie.substring(document.cookie.indexOf("user=")).indexOf(";") + document.cookie.indexOf("user="));
				console.log(user_preference);
				user_preference.siteUser = siteUser;
				chrome.storage.local.set({'user_preference': user_preference});
			}
			if(!user_preference.found){
				start_timer();
				setTimeout(search_for_order_and_refresh, user_preference.countdown_interval* 1000);
		
			}
			
		}
		else if ( document.URL.indexOf("order.php?id=") > -1 ){
			console.log("in order.php page");
			console.log(user_preference);
			user_preference.idSet = false;
			user_preference.pwSet = false;
			currentGame = document.getElementById("currentGame");
			nextElement = currentGame.nextSibling;
			while (!user_preference.idSet || !user_preference.pwSet){
				//console.log(nextElement);
				if (typeof nextElement.innerText == "undefined" &&  nextElement.textContent.trim().indexOf("ID:") > -1 ){
					console.log( nextElement.textContent.trim().substring(4));
					user_preference.id  = nextElement.textContent.trim().substring(4);
					user_preference.idSet = true;
					
				}
				
				if (typeof nextElement.innerText == "undefined"  && nextElement.textContent.trim().indexOf("PW:") > -1 ){
					console.log( nextElement.textContent.trim().substring(4));
					user_preference.password  = nextElement.textContent.trim().substring(4);
					user_preference.pwSet = true;
				}
				nextElement = nextElement.nextSibling;
			}
			chrome.storage.local.set({'user_preference': user_preference});
			if (user_preference.fromActiveOrderPage){
				user_preference.fromActiveOrderPage = false;
				chrome.storage.local.set({'user_preference': user_preference});
				chrome.extension.sendRequest({action: "found", user_preference: user_preference});
			}
			
			
				
		}
	}else{
		console.log("User_preference is undefined");
	}
	

});



chrome.extension.onRequest.addListener(function(request, sender, callback)
{
	
    switch(request.action)
    {
        case "start":

			
			chrome.storage.local.get('user_preference', function(result){
				user_preference = result.user_preference;
				if (document.URL.indexOf("activeorders.php") > -1 ){
					
					if(!user_preference.found){
						start_timer();
						countdownTimer = setTimeout(search_for_order_and_refresh, user_preference.countdown_interval * 1000);
					}
				}

			});
			break;
		case "stop":
			clearTimeout(countdownTimer);
			stop_timer();
			chrome.storage.local.get('user_preference', function(result){
				user_preference.found = true;
				chrome.storage.local.set({'user_preference':user_preference});
				chrome.extension.sendRequest({action: "stop"});
			});
			break;
    }
});


