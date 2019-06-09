var init = require('./js/init.js');
var userModel = require('./model/user.js');
const {ipcRenderer} = require('electron');
const NodeCouchDb = require('node-couchdb');
// node-couchdb instance with default options
const couch = new NodeCouchDb();

var loginBox,nifflerLogo;

function getUserNames(cb) {
	couch.mango("nf_users", {"selector":{}}).then(({data, headers, status}) => {
	    // data is json response
	    // headers is an object with all response headers
	    // status is statusCode number
	    console.log(JSON.stringify(data))
	    cb(null, data.docs);
	}, err => {
		cb(err);
	    // either request error occured
	    // ...or err.code=EDOCMISSING if document is missing
	    // ...or err.code=EUNKNOWN if statusCode is unexpected
	});
	// userModel.find(function(err,data){
	// 	if(err) cb(err);
	// 	else cb(null,data);
	// });
}

function start(){
	loginBox = new Vue({
		el:"#login",
		data: {
			loading:true,
			users:[],
			message:"",
			usernamesLoaded:false,
			noRegisteredUsers:false
		},
		methods:{
			registerNewName: function(){
				var newUsername = document.getElementById("new-username-input").value;
				if(this.alreadyExists(newUsername)){
					alert("Username already exists!");
				} else {
					
					addNewUser(newUsername, function(){
						loginBox.selectUser(newUsername);
					});
				}
			},
			alreadyExists:function(newUsername){
				for(user in this.users){
					if(this.users[user].name == newUsername) return true;
				}
				return false;
			},
			selectUser(username){
				ipcRenderer.send('open-user', {username:username});
			}

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
	setTimeout(initialize, 0);
}

function addNewUser(newUsername, cb){
	couch.insert("nf_users", {name:newUsername}).then(({data, headers, status}) => {
    // data is json response
    // headers is an object with all response headers
    // status is statusCode number
    cb(null, data);
}, err => {
    // either request error occured
    // ...or err.code=EDOCCONFLICT if document with the same id already exists
    db(err);
});
	// userModel.create({name:newUsername}, cb);
}

function initialize() {
	init.initialize(function(err) {
		loginBox.loading = false;
		if(err){
			die(err);
		} else {
			// slideLogoUp();
			document.getElementById("niffler-logo").style.paddingTop="50px";
			setTimeout(loadUserNamesAndPopulateComponent,300);
		}
	});
}
function die(err){
			loginBox.message = "Something went wrong :(";
			console.log("Error occurred while initialize - " + err);
			ipcRenderer.send('fatal-error', {message : "Unable to initialize - " + err});
}
function greetingMessage() {
	var items=  ["Identify yourself!", "Who ARE you?", "Please select a username", "Papers Please >.>"];
	return items[Math.floor(Math.random()*items.length)]
}

function loadUserNamesAndPopulateComponent(){
	// transition title to a bit above.
	getUserNames(function(err,data){
		if(err) die(err);
		else {
			loginBox.users = data;

			if(loginBox.users.length == 0 ){
				loginBox.noRegisteredUsers = true;
			}
			 else {
				loginBox.message=greetingMessage();
			}
			loginBox.usernamesLoaded=true;
		}
	});
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