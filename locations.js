var CELL_ID = 0, 
	HALLWAY_ID = 1;
	EMPTY_CELL_ID = 2;

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
					new Location("Hallway", "You are in a long hallway with many doors on both sides", []),
					new Location("Empty Cell", "You are in another cell, it seems as though no one has been here for a while", ["map"])
				];

//-1: Look back
// 0: No Connection
// 1: Look ahead
// 2: Left
// 3: Look back
// 4: Right
var connections = 
	[[ 0, 1, 0],	//Cell
	 [ 3, 0, 2],	//Hallway	
	 [ 0, 4, 0]];	//Empty Cell
var map = {
	locs: locations,
	connect: connections,
	openDoors: [[]],
}

function changeRoom(){
	for(var c = 0; c < map.connect.length; c++){
		if(map.connect[roomNum][c] == direction){ //if there is a connection in the direction you are facing
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
	for(i in tempDirs){
		console.log(player.directions);
	}
}

var roomNum = 0;
var direction = 0;
var offset = 0;