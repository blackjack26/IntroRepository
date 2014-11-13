function Player(name){
	this.name = name;
	this.items = [];
	this.actions = ["pickup", "drop"];
}
Player.prototype.pickup = function(item){
	this.items.push(item);
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

function updateActions(str){
	for(i in player.actions){
		if(player.actions[i].startsWith(str)){
			var help = document.querySelector("#help > ul");
			var helpItems = help.childNodes;
			for(i in helpItems){
				if(helpItems[i].textContent == actions[i]){
					helpItems[i].style.color = "red";
				}
			}
		}
	}
}

function report(){
	var inventory = document.querySelector("#inventory > ul");
	for(i in player.items){
		var liElement = document.createElement("LI");
		liElement.textContent = player.items[i];
		inventory.appendChild(liElement);
	}
	
	var help = document.querySelector("#help > ul");
	for(i in player.actions){
		var liElement = document.createElement("LI");
		liElement.textContent = player.actions[i];
		help.appendChild(liElement);
	}
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
		}
		updateActions(textbox.value);
	});
}

var player = new Player("Jack");
window.onload = gameStart;