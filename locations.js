function Location(name, description){
	this.name = name;
	this.description = description;
	this.items = [];
}

var loc0 = new Location("Location 0", "small box-like room with no windows");
var loc1 = new Location("Location 1", "large circular room");
var loc2 = new Location("Location 2", "outside and it is a nice day");

var locations = [loc0, loc1, loc2];

var connections = 
	[[0, 1, 1],
	 [1, 0, 1],
	 [1, 1, 0]];

var map = {
	locs: locations,
	connect: connections
}

var getAdjacentLocations = function(locNum){
	for(var i = 0; i < map.connect.length; i++){
		if(map.connect[locNum][i] == 1){
			console.log(map.locs[locNum].name + " is connceted to " + map.locs[i].name);
		}
	}
}

getAdjacentLocations(1);