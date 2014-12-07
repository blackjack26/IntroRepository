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
	setTimeout(function(){ $(".map").show() }, blindTime*1000);
	
}