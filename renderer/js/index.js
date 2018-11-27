var init = require('./js/init.js')
 var url = "mongodb://localyhost:27017/mydb";

init.initialize(url, function(err) {
	if(err){
		alert("Error occurred while initialize");
		exit(0);
	}
	alert("initlisation succ")
});

// alert("successs");
// console.log("succ intecjt code");
// var MongoClient = require('mongodb').MongoClient;

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });