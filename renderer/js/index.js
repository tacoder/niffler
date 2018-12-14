var init = require('./js/init.js')

var loginBox,nifflerLogo;

function getUserNames() {
	return ["abhinav","abhinav2","abhinav3"];
}

function start(){
	loginBox = new Vue({
		el:"#login",
		data: {
			loading:true,
			usernames:[],
			message:""
		}
	});
	nifflerLogo  = new Vue({
	  el: '#niffler-logo',
	  data: {
	    show: false
	  }
	});

	nifflerLogo.show=true;
	// setTimeout(function(){nifflerLogo.show=true},3000);
	setTimeout(initialize, 500);
}

function initialize() {
	init.initialize(function(err) {
		loginBox.loading = false;
		if(err){
			loginBox.message = "Something went wrong :(";
			console.log("Error occurred while initialize - " + err);
		} else {
			// slideLogoUp();
			loginBox.message=greetingMessage();
			document.getElementById("niffler-logo").style.paddingTop="50px"
			loadUserNamesAndPopulateComponent();
		}
	});
}

function greetingMessage() {
	var items=  ["Identify yourself!", "Who ARE you?", "Please select a username", "Papers Please >.>"];
	return items[Math.floor(Math.random()*items.length)]
}

function loadUserNamesAndPopulateComponent(){
	// transition title to a bit above.
	loginBox.usernames = getUserNames();
	if(loginBox.usernames.length == 0 )
		loginBox.message = "Add new user"
}

function startDelayed(){
	setTimeout(start,0);
}

window.addEventListener("load", startDelayed);

// alert("successs");
// console.log("succ intecjt code");
// var MongoClient = require('mongodb').MongoClient;

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });