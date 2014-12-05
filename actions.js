var questionAnswers = {
	//question-type: "answer"
	shape: "circle",
};

function isCorrect(answer, question){
	return questionAnswers[question] == answer;
}

function checkAnswer(answer){
	if(isCorrect(answer, player.question)){
		changeDescrip("hidden");
	}else{
		player.errorCount += 1;
		changeDescrip("incorrect");
	}
}

function specialInspectActions(roomLocDir){
	/**** Cell ****/
	if(roomLocDir[0] == CELL_ID){
		if(roomLocDir[1] == NORTH){
			if(map.openDoors[CELL_ID][NORTH] == 1)
				newActions = ["enter"];
			else
				newActions = ["look through"];
			if(player.items.length > 0)
				newActions.push("use");
		}else if(roomLocDir[1] == SOUTH && player.items.indexOf("key") < 0){
			newActions = ["insert finger"];
		}
	}else if(roomLocDir[0] == HALLWAY_ID){
		if(roomLocDir[1] == WEST){
			newActions = ["enter"];
		}else if(roomLocDir[1] == SOUTH){
			newActions = ["enter"];
		}
	}
}

function itemUsedIn(roomLocDir, item){
	/**** Cell ****/
	if(roomLocDir[0] == CELL_ID){
		if(roomLocDir[1] == NORTH){
			if(player.inspecting){
				if(item == "key"){
					player.drop(item);
					openDoor();
				}
			}
		}
	}
}

function getTextFrom(roomLocDir, actionType){
	if(actionType == "default"){
		return map.locs[roomLocDir[0]].description;
	}else if(actionType == "door"){
		return "The door opened!";
	}
	
	/**** CELL ****/
	if(roomLocDir[0] == CELL_ID){
		if(roomLocDir[1] == NEUTRAL){
			if(actionType == "think")
				return "How did I even get in this place? I don't remember anything.";
			if(actionType.indexOf("look") >= 0){
				if(player.direction == NORTH){
					if(map.openDoors[CELL_ID][NORTH] == undefined){
						return "You see a big metal door, it appears to be locked tight.";
					}else{
						return "You see a large metal door that is open.";
					}
				}
				if(player.direction == SOUTH)
					return "There's nothing but a concrete wall.";
				if(player.direction == WEST){
					unstageAction("inspect");
					return "There is a small barred window but it out of reach";
				}
				if(player.direction == EAST){
					unstageAction("inspect");
					return "There is a hairline crack in the wall, but that's it.";
				}
			}
		}else if(roomLocDir[1] == NORTH){
			if(actionType == "inspect"){
				return "There is some sort of circular opening near the handle of the door";
			}
			if(player.inspecting){
				if(actionType == "think")
					return "Maybe some sort of key goes here";
				if(actionType == "look through")
					return "You see a long hallway with other doors like yours";
				if(actionType == "punch")
					return "You hit the door and hurt your hand, good job";
			}
		}else if(roomLocDir[1] == SOUTH){
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
					stageAction("pickup");
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
	}else if(roomLocDir[0] == EMPTY_CELL_ID){
		if(roomLocDir[1] == NORTH){
			if(actionType == "inspect")
				return "LOOKING NORTH";
		}else if(roomLocDir[1] == WEST){
			if(actionType == "inspect")
				return "LOOKING WEST";
		}
	}
	
	/**** HALLWAY ****/
}