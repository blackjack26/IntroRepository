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
	document.getElementById("action").disabled = true;
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
	}, 6000);
	
}

function setWarningText(text){
	$("#effect").text(text);
}