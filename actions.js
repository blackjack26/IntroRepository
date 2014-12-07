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
	}
	/**** Hallway ****/
	else if(roomLocDir[0] == HALLWAY_ID){
		if(roomLocDir[1] == WEST){	
			if(map.openDoors[HALLWAY_ID][WEST] == 1)
				newActions = ["enter"];
			else
				newActions = ["look through"];
		}else if(roomLocDir[1] == NORTH){
			if(map.openDoors[HALLWAY_ID][NORTH] == 1)
				newActions = ["enter"];
			else
				newActions = ["walk"];
		}
	}
	/**** Empty Cell ****/
	else if(roomLocDir[0] == EMPTY_CELL_ID){
		if(roomLocDir[1] == WEST){
			newActions = ["jump"];
		}else if(roomLocDir[1] == SOUTH){
			newActions = ["pickup"];
		}
	}
	/**** Hallway2 ****/
	else if(roomLocDir[0] == HALLWAY2_ID){
		if(roomLocDir[1] == SOUTH){
			newActions = ["walk"];
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
	}
	
	/**** HALLWAY ****/
	else if(roomLocDir[0] == HALLWAY_ID){
		if(roomLocDir[1] == NEUTRAL){
			if(actionType == "think")
				return "Are there more people like me? Am I the only one?";
			if(actionType.indexOf("look") >= 0){
				if(player.direction == NORTH){
					return "There looks like there is another hallway extending from this one.";
				}
				if(player.direction == SOUTH){
					unstageAction("inspect");
					stageAction("enter");
					return "There is an open door to your holding cell.";
				}
				if(player.direction == WEST){
					return "There are a couple of doors like yours. They all appear to be locked too.";
				}
				if(player.direction == EAST){
					return "You see graffiti on the concrete wall, some of it seems to make out a word.";
				}
			}
		}else if(roomLocDir[1] == NORTH){
			if(actionType == "inspect"){
				return "There is a faint laser across your vision from wall to wall";
			}
			if(player.inspecting){
				if(actionType == "think")
					return "Maybe walking in front of the laser isn't a good idea";
				if(actionType == "punch")
					return "You swung in the air and looked like a fool.";
				if(actionType == "walk"){
					if(player.has("sunglasses")){
						openDoor();
						removeAction("walk");
						return "There was a flash but the sunglasses prevented any blindness.";
					}else{
						blinded();
						return "There was a bright flash and you are blinded for a little and you cannot move forward";
					}
				}					
			}
		}else if(roomLocDir[1] == WEST){
			if(actionType == "inspect")
				return "One of the doors seems ajar, maybe someone was in there.";
			if(player.inspecting){
				if(actionType == "think")
					return "Maybe I can find something if I get inside the cell.";
				if(actionType == "punch"){
					openDoor();
					return "The door broke off its rusted hinges and fell onto the floor.";
				}
				if(actionType == "look through")
					return "The cell is dark and there is not much visible to the eye.";
			}
		}else if(roomLocDir[1] == EAST){
			if(actionType == "inspect")
				return "The writing spells out the numbers 1, 1, and 5";
			if(player.inspecting){
				if(actionType == "think"){
					if(player.has("paper"))
						return "I wonder who this #115 guy is.";
					else
						return "What do these numbers mean?";
				}
				if(actionType == "punch"){
					player.actions.push("pickup");
					return "You broke some of the wall and a paint chip fell on the floor";
				}
			}
		}
	}
	
	/**** EMPTY CELL ****/
	else if(roomLocDir[0] == EMPTY_CELL_ID){
		if(roomLocDir[1] == NEUTRAL){
			if(actionType == "think")
				return "Maybe there are some items in here I could use.";
			if(actionType.indexOf("look") >= 0){
				if(player.direction == NORTH){
					return "There is a mirror on the wall above a sink.";
				}
				if(player.direction == SOUTH){
					return "You see a table-like structure that has some papers on it.";
				}
				if(player.direction == WEST){
					return "There is a window up high like the one in your cell. Sadly, you can't reach it.";
				}
				if(player.direction == EAST){
					unstageAction("inspect");
					stageAction("enter");
					return "The door you just destroyed is crumbled on the ground.";
				}
			}
		}else if(roomLocDir[1] == NORTH){
			if(actionType == "inspect"){
				if(hasEventOccured("mirror broke"))
					return "You see a broke mirror and a sad reflection of something that use to be happy.";
				else	
					return "You see a beautiful person named " + name + " staring back at you in the mirror.";
			}
			if(player.inspecting){
				if(actionType == "think")
					return "Do I look fat in this jump suit? Nahhh must be in my head.";
				if(actionType == "punch"){
					if(hasEventOccured("mirror broke"))
						return "You already broke the mirror, now you are just cutting your hand more.";
					else{
						addEvent("mirror broke");
						return "You broke the mirror and your fist is bleeding. That beautiful person is no longer visible in the mirror.";
					}
				}					
			}
		}else if(roomLocDir[1] == WEST){
			if(actionType == "inspect")
				return "The window...it's so...high";
			if(player.inspecting){
				if(actionType == "think")
					return "Why am I still looking over here, there is nothing.";
				if(actionType == "punch")
					return "Really, do you just punch anything??";
				if(actionType == "jump"){
					if(hasEventOccured("jumped"))
						return "I can't believe you actually thought you'd reach again. You can't jump very high";
					else{
						addEvent("jumped");
						return "HA! What a febel attempt, maybe if you try again you'll get it";
					}
				}
			}
		}else if(roomLocDir[1] == SOUTH){
			if(actionType == "inspect")
				return "You see a paper with the writing \"It was you inmate #115 who did it. You're guilty.\" Also there are some sunglasses on the table too.";
			if(player.inspecting){
				if(actionType == "think")
					return "Who is inmate #115, and what is he guilty of?";
				if(actionType == "punch")
					return "You're muscles contracted and prevented you from punching. Why do you punch so much?";
			}
		}
	}
	
	/**** Hallway2 ****/
	else if(roomLocDir[0] == HALLWAY2_ID){
		if(roomLocDir[1] == NEUTRAL){
			if(actionType == "think")
				return "Where did everyone go. I'm starting to feel like I'm the only one here.";
			if(actionType.indexOf("look") >= 0){
				if(player.direction == NORTH){
					return "Looks like the warden's office or some high official.";
				}
				if(player.direction == SOUTH){
					return "You see the other end of the hallway where your cell is.";
				}
				if(player.direction == WEST){
					return "There looks to be a door to outside this way.";
				}
				if(player.direction == EAST){
					return "There is another hallway extending with more cells like yours.";
				}
			}
		}else if(roomLocDir[1] == SOUTH){
			if(actionType == "inspect"){
				return "There is a faint laser across your vision from wall to wall";
			}
			if(player.inspecting){
				if(actionType == "think")
					return "Did I learn anything from this laser last time?";
				if(actionType == "punch")
					return "You swung in the air and looked like a fool.";
				if(actionType == "walk"){
					if(player.has("sunglasses")){
						removeAction("walk");
						stageAction("enter");
						return "There was a flash but the sunglasses prevented any blindness.";
					}else{
						blinded();
						return "There was a bright flash and you are blinded for a little and you cannot move forward";
					}
				}					
			}
		}
	}
}