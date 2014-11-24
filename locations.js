var CELL_ID = 0;

var FACE_BACKWARD = -1;
var NEUTRAL = 0;
var FACE_FORWARD = 1;

var DEFAULT_ACTIONS = ["look ahead", "look back", "think"];

function Location(name, description, items){
	this.name = name;
	this.description = description;
	this.items = items;
	this.actions = DEFAULT_ACTIONS;
}

var cell = new Location("Cell", "You are in a cell, not too much to see from the current spot", ["Key"]);
var locations = [cell];

var connections = 
	[[0]];

var map = {
	locs: locations,
	connect: connections
}

var getAdjacentLocations = function(locNum){
	for(var i = 0; i < map.connect.length; i++){
		if(map.connect[locNum][i] == 1){
			console.log(map.locs[locNum].name + " is connected to " + map.locs[i].name);
		}
	}
}

var roomNum = 0;
var direction = 0;

getAdjacentLocations(roomNum);