var init = require('./js/init.js')
console.log("started");
alert("just started.");

function getUserNames() {
	return ["abhinav","abhinav2","abhinav3"];
}

function start(){
	var loginBox = new Vue({
		el:"#login",
		data: {
			loading:true,
			message:"Loading stuff right now!"
		}
	});

	init.initialize(function(err) {
		loginBox.loading = false;
		if(err){
			loginBox.message = "Error during initialization :(";
			console.log("Error occurred while initialize - " + err);
		} else {
			loginBox.message = ""
		}
	});
}

function startDelayed(){
	setTimeout(start,5000);
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