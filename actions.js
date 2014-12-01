function checkAnswer(answer){
	if(player.question == "shape" && answer == "circle"){
		changeDescrip("hidden");
	}else{
		player.errorCount += 1;
		changeDescrip("incorrect");
	}
}

function specialInspectActions(roomLocDir){
	if(roomLocDir[0] == CELL_ID){
		if(roomLocDir[1] == FACE_FORWARD){
			newActions = ["look through"];
			if(player.items.length > 0)
				newActions.push("use");
		}else if(roomLocDir[1] == FACE_BACKWARD){
			newActions = ["insert finger"];
		}
	}
}

function itemUsedIn(roomLocDir, item){
	if(roomLocDir[0] == CELL_ID){
		if(roomLocDir[1] == FACE_FORWARD){
			if(player.inspecting){
				if(item == "key"){
					player.drop(item);
					changeRoom();
				}
			}
		}
	}
}

function getTextFrom(roomLocDir, actionType){
	if(actionType == "default"){
		return map.locs[roomLocDir[0]].description;
	}
	if(roomLocDir[0] == CELL_ID){
		if(roomLocDir[1] == NEUTRAL){
			if(actionType == "think")
				return "How did I even get in this place? I don't remember anything.";
			if(actionType == "look ahead")
				return "You see a big metal door, it appears to be locked tight.";
			if(actionType == "look back")
				return "There's nothing but a concrete wall.";
		}else if(roomLocDir[1] == FACE_FORWARD){
			if(actionType == "look back")
				return "You turned around and there's nothing but a concrete wall.";
			if(actionType == "inspect")
				return "There is some sort of circular opening near the handle of the door";
			if(player.inspecting){
				if(actionType == "think")
					return "Maybe some sort of key goes here";
				if(actionType == "look through")
					return "You see a long hallway with other doors like yours";
				if(actionType == "punch")
					return "You hit the door and hurt your hand, good job";
			}
		}else if(roomLocDir[1] == FACE_BACKWARD){
			if(actionType == "look ahead")
				return "You turned around and you see a big metal door, it appears to be locked tight.";
			if(actionType == "inspect")
				return "The wall has a tile pattern with all sorts of shapes and a small hole in the middle";
			if(player.inspecting){
				if(actionType == "think")
					return "Could these shapes mean something?";
				if(actionType == "insert finger"){
					player.question = "shape";
					document.getElementById("action").placeholder = "Answer the question";
					return "What shape do you see?";
				}
				if(actionType == "punch")
					return "You hit the wall and you cut your hand and broke a tile";
				if(actionType == "hidden"){
					player.errorCount = 0;
					player.question = "";
					document.getElementById("action").placeholder = "What will you do?";
					addNewAction("pickup");
					return "A panel on the wall opened up and you can see a <span style='text-decoration: underline; font-weight: bold;'> key</span>!";
				}
				if(actionType == "incorrect"){
					if(player.errorCount == 3){
						return "Strike 3! You have been terminated. Goodbye";
					}
					return "Strike " + player.errorCount + "!";
					
				}
			}
		}
	}
}