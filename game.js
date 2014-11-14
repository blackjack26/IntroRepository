var newActions = ["pickup", "drop"];
var newItems = [];
function Player(name){
	this.name = name;
	this.items = [];
	this.actions = [];
}
Player.prototype.pickup = function(item){
	this.items.push(item);
	newItems.push(item);
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
					helpItems[i].style.color = "red";
					helpItems[i].style.fontWeight = "initial";
				}else if(str.indexOf(helpItems[i].textContent) == 0){
					helpItems[i].style.color = "LimeGreen";
					helpItems[i].style.fontWeight = "bold";
				}else{
					helpItems[i].style.color = "black";
					helpItems[i].style.fontWeight = "initial";
				}
			}
		}
	}else{
		for(var i = 0; i < helpItems.length; i++){
			if(helpItems[i].nodeName != "#text"){
				helpItems[i].style.color = "black";
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
				if(inventoryItems[i].textContent.length == item.length){
					inventoryItems[i].style.color = "LimeGreen";
					inventoryItems[i].style.fontWeight = "bold";
				}else if(item != "" && inventoryItems[i].textContent.indexOf(item) == 0){
					inventoryItems[i].style.color = "red";
					inventoryItems[i].style.fontWeight = "initial";
				}else{
					inventoryItems[i].style.color = "black";
					inventoryItems[i].style.fontWeight = "initial";
				}
			}
		}
	}else{
		for(var i = 0; i < inventoryItems.length; i++){
			if(inventoryItems[i].nodeName != "#text"){
				inventoryItems[i].style.color = "black";
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

function addAction(action){
	var help = document.querySelector("#help > ul");
	var liElement = document.createElement("LI");
	liElement.textContent = action;
	help.appendChild(liElement);
	player.actions.push(action);
}

function interpret(str){
	var obj = {};
	var strArray = str.split(" ");
	obj.action = strArray[0];
	strArray.shift();
	obj.object = strArray.join(" ");
	return obj;
}

function execute(obj){
	if(player.actions.indexOf(obj.action) >= 0)
		player[obj.action](obj.object);
}

function gameStep(str){
	var obj = interpret(str);
	execute(obj);
	report();
}

function gameStart(){
	report();
	var textbox = document.getElementById("action");
	textbox.addEventListener("keyup", function(event){
		if(event.keyCode == 13){
			gameStep(textbox.value);
			textbox.value = "";
		}
		updateActions(textbox.value);
		updateInventory(textbox.value);
	});
}

var player = new Player("Jack");
window.onload = gameStart;