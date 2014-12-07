var CELL_ID = 0, 
	HALLWAY_ID = 1;
	EMPTY_CELL_ID = 2;
	HALLWAY2_ID = 3;

var NEUTRAL = 0,
	NORTH = 1,
	WEST = 2,
	SOUTH = 3,
	EAST = 4;


	
var DEFAULT_ACTIONS = ["look ahead", "look back", "look left", "look right", "think"];

function Location(name, description, items){
	this.name = name;
	this.description = description;
	this.items = items;
	this.actions = DEFAULT_ACTIONS;
	this.events = [];
}

Location.prototype.addNewItem = function(item){
	this.items.push(item);
}

Location.prototype.removeItem = function(item){
	var index = this.items.indexOf(item);
	if(index >= 0){
		this.items.splice(index,1);
	}
}

var locations = [ 
					new Location("Cell", "You are in a cell, not too much to see from the current spot", ["key"]),
					new Location("Hallway", "You are in a long hallway with many doors on both sides", ["paint chip"]),
					new Location("Empty Cell", "You are in another cell, it seems as though no one has been here for a while", ["sunglasses", "paper"]),
					new Location("Hallway", "You are at the other end of the hallway", []),
				];

//-1: Look back
// 0: No Connection
// 1: Look ahead
// 2: Left
// 3: Look back
// 4: Right
var connections = 
	[[ 0, 1, 0, 0],	//Cell
	 [ 3, 0, 2, 1],	//Hallway	
	 [ 0, 4, 0, 0], //Empty Cell
	 [ 0,-1, 0, 0]];	//Hallway2
	 
function zeros(dimensions){
	var array = [];
	
	for(var i = 0; i < dimensions[0]; ++i){
		array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
	}
	
	return array;
}

var openDoors = zeros([locations.length, locations.length]);

var map = {
	locs: locations,
	connect: connections,
	openDoors: openDoors,
}


function changeRoom(){
	for(var c = 0; c < map.connect.length; c++){
		if(map.connect[roomNum][c] == direction){ //if there is a connection in the direction you are facing
			moveIconInto(roomNum, c);
			roomNum = c;
			document.querySelector("#currRoom > p").textContent = map.locs[roomNum].name;
			player.return(); //resets to the default
			return;
		}
	}
	alert("no room connections");
}

function openDoor(){
	for(c in map.connect){
		if(map.connect[roomNum][c] == direction){
			map.openDoors[roomNum][c] = 1; //open door
			changeDescrip("door");
			addRoomToMap(c);
			stageAction("enter");
		}
	}
}

function adjustDirectionsToOffset(){
	offset = direction-1;
	console.log("Offset: " + offset + "\nDirection: " + direction);
	var tempDirs = [NORTH, WEST, SOUTH, EAST];
	for(var i = 0; i < offset; i++){
		for(x in tempDirs){
			tempDirs[x]++;
			if(tempDirs[x] > 4)
				tempDirs[x] = 1;
		}
	}
	player.directions.forward = tempDirs[0];
	player.directions.left = tempDirs[1];
	player.directions.back = tempDirs[2];
	player.directions.right = tempDirs[3];
	console.log(player.directions);
}

function moveIconInto(oldNum, newNum){
	$("#room"+oldNum).removeClass("hasPlayer");
	$("#player").remove();
	$("#room"+newNum).addClass("hasPlayer");
	$(".hasPlayer").append("<div id='player'></div>")
	changePlayerIcon(player.directions.forward);
	addRoomToMap(newNum);
}

function addRoomToMap(num){
	$("#room"+num).show();
}

function addEvent(event){
	map.locs[roomNum].events.push(event);
}

function hasEventOccured(event){
	return map.locs[roomNum].events.indexOf(event) >= 0;
}

var roomNum = 0;
var direction = 0;
var offset = 0;