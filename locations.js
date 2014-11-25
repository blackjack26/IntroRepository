var CELL_ID = 0, 
	HALLWAY_ID = 1;

var FACE_BACKWARD = -1,
	NEUTRAL = 0,
	FACE_FORWARD = 1;

var DEFAULT_ACTIONS = ["look ahead", "look back", "think"];

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

var cell = new Location("Cell", "You are in a cell, not too much to see from the current spot", ["key"]);
var hallway = new Location("Hallway", "You are in a long hallway with many doors on both sides", []);
var locations = [cell, hallway];

//-1: Look back
// 0: No Connection
// 1: Look ahead
// 2: Left
// 3: Right
var connections = 
	[[0,1],
	 [-1,0]];

var map = {
	locs: locations,
	connect: connections
}

function changeRoom(){
	for(var c = 0; c < map.connect.length; c++){
		if(map.connect[roomNum][c] == direction){ //if there is a connection in the direction you are facing
			roomNum = c;
			player.return(); //resets to the default
			return;
		}
	}
	alert("no room connections");
}

var roomNum = 0;
var direction = 0;