
var click = function(){
	if(document.getElementById('action').value == "Scream!"){
		document.getElementById('descrip').innerHTML = "HA, you could've ran, but you wasted your time screaming";
	}
}	
var runSomeTests = function(){
	var helpList = document.querySelector('#help > ul');

	var actionRun = document.createElement("LI");
	actionRun.innerHTML = "Run";
	helpList.appendChild(actionRun);

	var actionRun = document.createElement("LI");
	actionRun.innerHTML = "Look";
	helpList.appendChild(actionRun);

	var actionRun = document.createElement("LI");
	actionRun.innerHTML = "Scream!";
	helpList.appendChild(actionRun);
}
window.onload = runSomeTests;

document.getElementById("button").onclick = click;
document.getElementsByTagName("h1")[0].innerHTML = "The Horrors of Marist";