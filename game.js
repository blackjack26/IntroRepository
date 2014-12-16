var newActions = map.locs[roomNum].actions;
var newItems = [];
function Player(name){
	this.name = name;
	this.items = [];
	this.actions = [];
	this.inspecting = false;
	this.question = "";
	this.errorCount = 0;
	this.directions = {
		forward: 1,
		left: 2,
		back: 3,
		right: 4
	}
	this.direction = 0;
	this.cheating = false;
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
		if(item == "the bass"){
			changeDescrip("bass");
		}
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

Player.prototype.jump = function(){
	changeDescrip("jump");
}

Player.prototype.think = function(){
	changeDescrip("think");
}

Player.prototype.lookahead = function(){
	this.direction = this.directions.forward;
	looking();
	changeDescrip("look ahead");
	direction = this.direction;
}

Player.prototype.lookback = function(){
	this.direction = this.directions.back;
	looking();
	changeDescrip("look back");
	direction = this.direction;
}

Player.prototype.lookleft = function(){
	this.direction = this.directions.left;
	looking();
	changeDescrip("look left");
	direction = this.direction;
}

Player.prototype.lookright = function(){
	this.direction = this.directions.right;
	looking();
	changeDescrip("look right");
	direction = this.direction;
}

Player.prototype.lookat = function(){
	changeDescrip("look at");
}

function looking(){
	removeActions(DEFAULT_ACTIONS);
	changePlayerIcon(player.direction);
	stageAction("inspect");
	stageAction("return");
}

function changePlayerIcon(dir){
	switch(dir){
		case NORTH: rotateMap(0); break;
		case WEST: rotateMap(90); break;
		case SOUTH: (player.directions.right == 3) ? rotateMap(-180) : rotateMap(180); break;
		case EAST: (player.directions.left == 4) ? rotateMap(270) : rotateMap(-90); break;
		default: return;
	}
}

Player.prototype.inspect = function(){
	changeDescrip("inspect");
	this.inspecting = true;
	removeAllActions();
	specialInspectActions([roomNum, direction]);
	stageAction("return");
	stageAction("think");
	stageAction("punch");
}

Player.prototype.return = function(){
	changePlayerIcon(player.directions.forward);
	document.getElementById("action").placeholder = "What will you do?";
	direction = NEUTRAL;
	newActions = DEFAULT_ACTIONS;
	this.inspecting = false;
	removeAllActions();
	changeDescrip("default");
}

Player.prototype.use = function(item){
	itemUsedIn([roomNum,direction], item);
}

Player.prototype.enter = function(){
	adjustDirectionsToOffset();
	changeRoom();
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

Player.prototype.walk = function(){
	changeDescrip("walk");
}

Player.prototype.has = function(item){
	return this.items.indexOf(item) >= 0;
}

Player.prototype.givemeitall = function(){
	var items = ["sunglasses", "key", "paper"];
	for(var i in items){
		this.items.push(items[i]);
		newItems.push(items[i]);
	}
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

function removeActions(actionArray){
	for(a in actionArray){
		removeAction(actionArray[a]);
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

function stageAction(action){
	newActions.push(action);
}

function unstageAction(action){
	var index = newActions.indexOf(action);
	if(index >= 0)
		newActions.splice(index,1);
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
	if(str.indexOf("look") != 0 && str.indexOf("insert") != 0 &&
			player.question == "" && str.indexOf("I solemnly") != 0 &&
			str.indexOf("Mischief")!=0)
	{
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
		if(obj.action == "exit"){
			player.question = "";
			player.return();
			setWarningText("");
		}else{
			checkAnswer(obj.action);
		}
	}else if(obj.action == "I solemnly swear I'm up to no good"){
		setWarningText("Cheater cheater pumpkin eater");
		player.cheating = true;
	}else if(obj.action == "Mischief managed"){
		setWarningText("");
		player.cheating = false;
	}else if(player.cheating){
		if(obj.action.indexOf("look") == 0 || obj.action.indexOf("insert") == 0){
			player[obj.action.split(" ").join("")]();
		}else{
			player[obj.action](obj.object);
		}
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
	$("#gameScreen").show();
	$("#options").hide();
	name = document.querySelector("#options > #name").value;
	hat = document.querySelector("#select").value;
	randomNums = getThreeRandomNums();
	randNumStr = randomNumsStr();
	document.getElementById("descrip").textContent = name + ", " + map.locs[0].description;
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

function getOptions(){
	$("#startGame").click(function(){
		if(document.querySelector("#name").value != "" && $("#select").val() != "null")
			gameStart();
		else{
			if(document.querySelector("#name").value == ""){
				$("#name").addClass("empty");
			}else if(document.querySelector("#name").value != undefined){
				$("#name").removeClass("empty");
			}
			if($("#select").val() == "null"){
				$("#select").addClass("empty");
			}else if($("#select").val() != "null"){
				$("#select").removeClass("empty");
			}
		}
	});
}

var player = new Player("Jack");
$("#gameScreen").hide();
window.onload = getOptions;
var name = "";
var hat = "";
var randomNums, randNumStr;