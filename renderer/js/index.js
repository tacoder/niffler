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
		}
	});
	nifflerLogo  = new Vue({
	  el: '#niffler-logo',
	  data: {
	    show: false
	  }
	});

	nifflerLogo.show=true;
	setTimeout(initialize, 5000);
}

function initialize() {
	init.initialize(function(err) {
		loginBox.loading = false;
		if(err){
			console.log("Error occurred while initialize - " + err);
		} else {
			// slideLogoUp();
			document.getElementsByClassName("shiny")[0].style.paddingTop="50px"
			loadUserNamesAndPopulateComponent();
		}
	});
}

function loadUserNamesAndPopulateComponent(){
	// transition title to a bit above.
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