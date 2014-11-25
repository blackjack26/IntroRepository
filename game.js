var newActions = map.locs[roomNum].actions;
var newItems = [];
function Player(name){
	this.name = name;
	this.items = [];
	this.actions = [];
	this.inspecting = false;
	this.question = "";
	this.errorCount = 0;
}
Player.prototype.pickup = function(item){
	for(i in map.locs[roomNum].items){
		if(map.locs[roomNum].items[i] == item){
			this.items.push(item);
			newItems.push(item);
			map.locs[roomNum].removeItem(item);
		}
	}

}
Player.prototype.drop = function(item){
	var index = this.items.indexOf(item);
	if(index >= 0){
		this.items.splice(index,1);
		
		var inventory = document.querySelector("#inventory > ul");
		var inventoryItems = inventory.childNodes;
		for(i in inventoryItems){
			if(inventoryItems[i].textContent == item){
				inventory.removeChild(inventoryItems[i]);
				break;
			}
		}
	}
}

Player.prototype.think = function(){
	changeDescrip("think");
}

Player.prototype.lookahead = function(){
	changeDescrip("look ahead");
	removeAction("look ahead");
	removeAction("think");
	addNewAction("inspect");
	addNewAction("look back");
	direction = FACE_FORWARD;
}

Player.prototype.lookback = function(){
	changeDescrip("look back");
	removeAction("think");
	removeAction("look back");
	addNewAction("inspect");
	addNewAction("look ahead");
	direction = FACE_BACKWARD;
}

Player.prototype.inspect = function(){
	changeDescrip("inspect");
	this.inspecting = true;
	removeAllActions();
	specialInspectActions([roomNum, direction]);
	addNewAction("return");
	addNewAction("think");
	addNewAction("punch");
}

Player.prototype.return = function(){
	direction = NEUTRAL;
	newActions = DEFAULT_ACTIONS;
	this.inspecting = false;
	removeAllActions();
	changeDescrip("default");
}

Player.prototype.use = function(item){
	itemUsedIn([roomNum,direction], item);
}

Player.prototype.punch = function(){
	changeDescrip("punch");
}

Player.prototype.lookthrough = function(){
	changeDescrip("look through");
}

Player.prototype.insertfinger = function(){
	changeDescrip("insert finger");
}

function changeDescrip(type){
	var descrip = document.getElementById("descrip");
	descrip.innerHTML = getTextFrom([roomNum,direction], type);
}

function removeAllActions(){
	var num = player.actions.length;
	for(var i = 0; i < num; i++){
		removeAction(player.actions[0]);
	}
}

function removeAction(action){
	var index = player.actions.indexOf(action);
	if(index >= 0){
		player.actions.splice(index,1);
		
		var help = document.querySelector("#help > ul");
		var helpItems = help.childNodes;
		for(i in helpItems){
			if(helpItems[i].textContent == action){
				help.removeChild(helpItems[i]);
				break;
			}
		}
	}
}

function updateActions(str){
	var help = document.querySelector("#help > ul");
	var helpItems = help.childNodes;
	if(str != ""){
		for(var i = 0; i < helpItems.length; i++){
			if(helpItems[i].nodeName != "#text"){
				if(helpItems[i].textContent.indexOf(str) == 0 && helpItems[i].textContent.length != str.length){
					helpItems[i].style.color = "orange";
					helpItems[i].style.fontWeight = "initial";
				}else if(str.indexOf(helpItems[i].textContent) == 0){
					helpItems[i].style.color = "LimeGreen";
					helpItems[i].style.fontWeight = "bold";
				}else{
					helpItems[i].style.color = "white";
					helpItems[i].style.fontWeight = "initial";
				}
			}
		}
	}else{
		for(var i = 0; i < helpItems.length; i++){
			if(helpItems[i].nodeName != "#text"){
				helpItems[i].style.color = "white";
				helpItems[i].style.fontWeight = "initial";
			}
		}
	}
}

function updateInventory(str){
	var inventory = document.querySelector("#inventory > ul");
	var inventoryItems = inventory.childNodes;
	if(str != ""){
		for(var i = 0; i < inventoryItems.length; i++){
			if(inventoryItems[i].nodeName != "#text"){
				var item = str.substring(str.indexOf(" ")+1);
				if(item != "" && inventoryItems[i].textContent.indexOf(item) == 0){
					if(inventoryItems[i].textContent.length == item.length){
						inventoryItems[i].style.color = "LimeGreen";
						inventoryItems[i].style.fontWeight = "bold";
					}else{
						inventoryItems[i].style.color = "orange";
						inventoryItems[i].style.fontWeight = "initial";
					}
				}else{
					inventoryItems[i].style.color = "white";
					inventoryItems[i].style.fontWeight = "initial";
				}
			}
		}
	}else{
		for(var i = 0; i < inventoryItems.length; i++){
			if(inventoryItems[i].nodeName != "#text"){
				inventoryItems[i].style.color = "white";
				inventoryItems[i].style.fontWeight = "initial";
			}
		}
	}
}

function report(){
	
	for(i in newItems){
		addItems(newItems[i]);
	}
	for(i in newActions){
		if(player.actions.indexOf(newActions[i]) < 0)
			addAction(newActions[i]);
	}
	newActions = [];
	newItems = [];
}

function addItems(item){
	var inventory = document.querySelector("#inventory > ul");
	var liElement = document.createElement("LI");
	liElement.textContent = item;
	inventory.appendChild(liElement);
}

function addNewAction(action){
	newActions.push(action);
}

function addAction(action){
	var help = document.querySelector("#help > ul");
	var liElement = document.createElement("LI");
	liElement.textContent = action;
	help.appendChild(liElement);
	player.actions.push(action);
}

function interpret(str){
	var obj = {};
	if(str.indexOf("look") != 0 && str.indexOf("insert") != 0 && player.question == ""){
		var strArray = str.split(" ");
		obj.action = strArray[0];
		strArray.shift();
		obj.object = strArray.join(" ");
	}else{
		obj.action = str;
		obj.object = "";
	}
	return obj;
}

function execute(obj){
	if(player.question != ""){
		checkAnswer(obj.action);
	}else if(player.actions.indexOf(obj.action) >= 0){
		if(obj.action.indexOf("look") == 0 || obj.action.indexOf("insert") == 0){
			player[obj.action.split(" ").join("")]();
		}else{
			player[obj.action](obj.object);
		}
	}
	
	if(map.locs[roomNum].items.length == 0){
		removeAction("pickup");
	}
	if(player.items.length == 0){
		removeAction("use");
	}
}

function gameStep(str){
	var obj = interpret(str);
	execute(obj);
	report();
	if(player.errorCount == 3){
		setTimeout(function(){location.reload();}, 3000);
	}
}

function gameStart(){
	var ENTER_KEY = 13;	
	var textbox = document.getElementById("action");
	report();
	textbox.addEventListener("keyup", function(event){
		if(event.keyCode == ENTER_KEY){
			gameStep(textbox.value);
			textbox.value = "";
		}
		updateActions(textbox.value);
		updateInventory(textbox.value);
	});
}

var player = new Player("Jack");
window.onload = gameStart;