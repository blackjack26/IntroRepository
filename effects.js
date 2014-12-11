function blinded(){
	var blindTime = 15;
	$("#effect").text("Blindness: " + (blindTime) + " sec");
	$(".map").hide();
	var time = 0;
	var timer = setInterval(function(){
		time++;
		$("#effect").text("Blindness: " + (blindTime-time) + " sec");
		if(time == blindTime){
			clearInterval(timer);
		}
	}, 1000);
	setTimeout(function(){ 
			$(".map").show();
			$("#effect").hide();
		}, blindTime*1000);	
}

function alarm(){
	document.getElementById("action").placeholder = "";
	document.getElementById("action").disabled = true;
	addEvent("punch");
	$("#action").addClass("disabled");
	setTimeout(function(){
		if(hat == "Fedora"){
			openDoor();
		}else if(hat == "Top Hat"){
			openDistDoor(HALLWAY2_ID, NORTH);
		}else if(hat == "Sports Hat"){
			openDistDoor(HALLWAY2_ID, WEST);
		}
		changeDescrip(hat);
		$("#action").removeClass("disabled");
		document.getElementById("action").disabled = false;
		document.getElementById("action").placeholder = "What will you do?";
	}, 6000);
	
}

function setWarningText(text){
	$("#effect").text(text);
}

function rotateMap(degrees){
	var currRoomDiv = $(".hasPlayer");
	var top = parseInt(currRoomDiv.css("margin-top").substr(0, currRoomDiv.css("margin-top").indexOf("px")))+9;
	var left = parseInt(currRoomDiv.css("margin-left").substr(0, currRoomDiv.css("margin-left").indexOf("px")))+10;
		
	var map = $(".map");
	$(map).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                 '-moz-transform' : 'rotate('+ degrees +'deg)',
                 '-ms-transform' : 'rotate('+ degrees +'deg)',
                 'transform' : 'rotate('+ degrees +'deg)',
				 'transition': '1s transform',
				 'transform-origin': left + "% " + top + "%"});
				 
	$(".compass").css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                 '-moz-transform' : 'rotate('+ degrees +'deg)',
                 '-ms-transform' : 'rotate('+ degrees +'deg)',
                 'transform' : 'rotate('+ degrees +'deg)',
				 'transition': '1s transform',
				 'transform-origin': "50% 50%"});
				 
	$(".compass > p").css({'-webkit-transform' : 'rotate('+ -degrees +'deg)',
                 '-moz-transform' : 'rotate('+ -degrees +'deg)',
                 '-ms-transform' : 'rotate('+ -degrees +'deg)',
                 'transform' : 'rotate('+ -degrees +'deg)',
				 'transition': '1s transform',
				 'transform-origin': "50% 50%"});
}

function adjustMap(){
	var moves = {1 : "0px, 20px",
				 2 : "20px, 0px",
				 3 : "0px, -20px",
				 4 : "-20px, 0px"}
				 
	var moveNums = [[0,20],[20,0],[0,-20],[-20,0]];
	/*
	$(".map-mover").css({
		'transform' : 'translate('+moves[direction]+')',
		'transition': '1s transform ease-in'
	});
	*/
	var margTop = parseInt($(".map").css("margin-top").substr(0,$(".map").css("margin-top").indexOf("px")));
	var margLeft = parseInt($(".map").css("margin-left").substr(0,$(".map").css("margin-left").indexOf("px")));

	$(".map").css("margin-top", (margTop+moveNums[direction-1][1])+"px");
	$(".map").css("margin-left", (margLeft+moveNums[direction-1][0])+"px");
}