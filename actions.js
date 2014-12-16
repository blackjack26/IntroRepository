var questionAnswers = {
	//question-type: "answer"
	shape: "circle",
	exit: "NSE",
};

function isCorrect(answer, question){
	return questionAnswers[question] == answer;
}

function checkAnswer(answer){
	if(isCorrect(answer, player.question)){
		setWarningText("");
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
			if(map.openDoors[CELL_ID][HALLWAY_ID] == 1)
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
			if(map.openDoors[HALLWAY_ID][EMPTY_CELL_ID] == 1)
				newActions = ["enter"];
			else
				newActions = ["look through"];
		}else if(roomLocDir[1] == NORTH){
			if(map.openDoors[HALLWAY_ID][HALLWAY2_ID] == 1)
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
		}else if(roomLocDir[1] == NORTH){
			if(map.openDoors[HALLWAY2_ID][WARDEN_ID] == 1)
				newActions = ["enter"];
		}else if(roomLocDir[1] == EAST){
			if(map.openDoors[HALLWAY2_ID][HALLWAY3_ID] == 1)
				newActions = ["enter"];
			else if(player.has("master key"))
				newActions = ["use"];
		}else if(roomLocDir[1] == WEST){
			if(map.openDoors[HALLWAY2_ID][COURTYARD_ID] == 1)
				newActions = ["enter"];
			else if(player.has("master key"))
				newActions = ["use"];
		}
	}
	
	/**** Warden ****/
	else if(roomLocDir[0] == WARDEN_ID){
		if(roomLocDir[1] == SOUTH){
			newActions = ["enter"];
		}else if(roomLocDir[1] == NORTH){
			newActions = ["look at"];
		}else if(roomLocDir[1] == WEST){
			if(!hasEventOccured("master_lock"))
				newActions = ["look at"];
		}
	}
	
	/**** Hallway3 ****/
	else if(roomLocDir[0] == HALLWAY3_ID){
		if(roomLocDir[1] == WEST){
			newActions = ["enter"];
		}
	}
	
	/**** Courtyard ****/
	else if(roomLocDir[0] == COURTYARD_ID){
		if(roomLocDir[1] == EAST){
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
	
	/**** Hallway2 ****/
	if(roomLocDir[0] == HALLWAY2_ID){
		if(roomLocDir[1] == WEST){
			if(player.inspecting){
				if(item == "master key"){
					openDoor();
				}
			}
		}else if(roomLocDir[1] == EAST){
			if(player.inspecting){
				if(item == "master key"){
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
	}else if(actionType == "bass"){
			setTimeout(function(){location.reload();}, 15000);
			return "Congrats! You win, what do you win?? You have escaped your own entrapment in your mind. Now here is a nice room in your very own cell! Maybe your thoughts will have helped you to escape it.";
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
					setWarningText("Type 'exit' to return out of the question");
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
				if(hasEventOccured("punch2")){
					openDoor();
					return "You found a secret room!";
				}else if(hasEventOccured("punch")){
					addEvent("punch2");
					return "You made a bigger dent in the wall.";
				}else if(actionType == "punch"){
					addEvent("punch");
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
		}else if(roomLocDir[1] == NORTH){
			if(actionType == "inspect"){
				return "It is a glass door and the light seems to be off inside";
			}
			if(player.inspecting){
				if(actionType == "think")
					return "Maybe I can try and get inside of this office.";
				if(actionType == "punch")
					return "The glass didn't budge. It must be a lot thicker than it seems";
			}
		}else if(roomLocDir[1] == EAST){
			if(actionType == "inspect")
				return "The gate is down and the hallway is closed off.";
			if(player.inspecting){
				if(actionType == "think")
					return "I wonder why they closed off this hallway, maybe there is a way to get down there.";
				if(actionType == "punch"){
					if(!hasEventOccured("punch")){
						alarm();
						return "Your hand got stuck in the gates and an alarm began to sound";
					}else{
						return "Stop punching...just stop.";
					}
				}
				if(actionType == "Fedora")
					return "A suave man came up to you and opened the gate you were stuck on, closed it, then unlocked the warden's office. The alarm stopped and the man left.";
				if(actionType == "Top Hat")
					return "A fancy man came up to you and unlocked the Warden's office so you could meet with him about bonds. The alarm stopped and the man left.";
				if(actionType == "Sports Hat")
					return "A referee came up to you and unlocked the door to the sports field in the courtyard. The alarm stopped and the man left.";
			}
		}else if(roomLocDir[1] == WEST){
			if(actionType == "inspect")
				return "The door leads to some sports looking field. Not sure what sport.";
			if(player.inspecting){
				if(actionType == "think")
					return "Maybe theres something in the dirt that I might need";
				if(actionType == "punch")
					return "You're not a boxer, cause apparently you think you are";
			}
		}
	}
	
	/**** Warden ****/ 
	else if(roomLocDir[0] == WARDEN_ID){
		if(roomLocDir[1] == NEUTRAL){
			if(actionType == "think")
				return "I wonder what kind of things in here will help me get out.";
			if(actionType.indexOf("look") >= 0){
				if(player.direction == NORTH){
					return "There is a large desk with the name 'Richtofen' engraved.";
				}
				if(player.direction == SOUTH){
					unstageAction("inspect");
					stageAction("enter"); 
					return "You see the open door to the office you just walked through.";
				}
				if(player.direction == WEST){
					if(!hasEventOccured("master_key"))
						return "There is a small locker that looks to be closed.";
					return "There is an open locker";
				}
				if(player.direction == EAST){
					unstageAction("inspect"); 
					return "You see a giant portrait of a man in a suit.";
				}
			}
		}else if(roomLocDir[1] == NORTH){
			if(actionType == "inspect")
				return "There are many things on the desk, but mostly papers that seem completely useless.";
			if(player.inspecting){
				if(actionType == "think")
					return "There has got to be something important over here.";
				if(actionType == "punch")
					return "You pushed some useless papers onto the floor.";
				if(actionType == "look at")
					return "There is a paper dated " + randomNums[0] + "/" + randomNums[1] + "/" + randomNums[2] + ". It is some notice to the warden about a new inmate #115.";
			}
		}else if(roomLocDir[1] == WEST){
			if(actionType == "inspect")
				return "The small locker is pretty small but has a combination lock.";
			if(player.inspecting){
				if(actionType == "think")
					return "There must be a combination to this somewhere.";
				if(actionType == "punch")
					return "You made a loud noise but nothing more than that";
				if(actionType == "look at"){
					setWarningText("Type 'exit' to return out of the question");
					questionAnswers.lock = randNumStr;
					player.question = "lock";
					document.getElementById("action").placeholder = "Enter Combination";
					return "Enter the combination for the locker";
				}
				if(actionType == "hidden"){
					addEvent("master_key");
					player.errorCount = 0;
					player.question = "";
					document.getElementById("action").placeholder = "What will you do?";
					stageAction("pickup");
					return "The locker opened and you can see a <span style='text-decoration: underline; font-weight: bold;'>master key</span>!";
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
	
	/**** Secret Room ****/
	else if(roomLocDir[0] == SECRET_ID){
		if(roomLocDir[1] == NEUTRAL){
			if(actionType == "think")
				return "I'm so awesome, I found a secret room.";
			if(actionType.indexOf("look") >= 0){
				if(player.direction == NORTH){
					unstageAction("inspect");
					addEvent("north");
					return "There is a giant 'I' on the wall.";
				}
				if(player.direction == SOUTH){
					unstageAction("inspect");
					addEvent("south");
					return "There are two I's on this wall.";
				}
				if(player.direction == EAST){
					unstageAction("inspect");
					if(hasEventOccured("north") && hasEventOccured("south")){
						setWarningText("Type 'exit' to return out of the question");
						player.question = "exit";
						document.getElementById("action").placeholder = "Enter Password";
						return "Enter the password to escape!!!";
					}
					return "There are three I's on the wall.";
				}
				if(player.direction == WEST){
					unstageAction("inspect"); 
					stageAction("enter"); 
					return "You see the large hole in the wall you made.";
				}
			}
		}else if(roomLocDir[1] == EAST){
			if(actionType == "hidden"){
				setTimeout(function(){location.reload();}, 15000);
				return "Congrats! You win, what do you win?? You have escaped your own entrapment in your mind. Now here is a nice room in your very own cell! Maybe your thoughts will have helped you to escape it.";
			}
		}
	}
	
	/**** Courtyard ****/
	else if(roomLocDir[0] == COURTYARD_ID){
		if(roomLocDir[1] == NEUTRAL){
			if(actionType == "think"){
				if(!hasEventOccured("skrillex"))
					return "I feel like there is nothing out here.";
				return "Maybe I should do with that bass as Skrillex does";
			}
			if(actionType.indexOf("look") >= 0){
				if(player.direction == NORTH){
					unstageAction("inspect");
					stageAction("pickup");
					stageAction("drop");
					addEvent("skrillex");
					return "There is a man standing there with 'the bass' on the ground in front of him.";
				}
				if(player.direction == SOUTH){
					unstageAction("inspect");
					return "Nothing but a wall of some cell in the building";
				}
				if(player.direction == EAST){
					unstageAction("inspect");
					stageAction("enter");
					return "There is the door back inside opened.";
				}
				if(player.direction == WEST){
					unstageAction("inspect"); 
					return "There is a giant cliff going into the foggy abyss.";
				}
			}
		}
	}
	
	/**** Hallway 3 ****/
	else if(roomLocDir[0] == HALLWAY3_ID){
		if(roomLocDir[1] == NEUTRAL){
			if(actionType == "think")
				return "I'm feeling some music right now. The bass is always the best.";
			if(actionType.indexOf("look") >= 0){
				if(player.direction == NORTH){
					unstageAction("inspect");
					return "This wall was so boring all that is written on it is 'undefined'";
				}
				if(player.direction == SOUTH){
					unstageAction("inspect");
					return "Don't worry about it, just a crematorium.";
				}
				if(player.direction == EAST){
					unstageAction("inspect");
					return "Its too far of a walk to go anywhere that way, so just don't worry about that.";
				}
				if(player.direction == WEST){
					unstageAction("inspect"); 
					stageAction("enter");
					return "There's the door to humanity....not, go in there.";
				}
			}
		}
	}
}