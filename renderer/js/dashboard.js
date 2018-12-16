var init = require('./js/init.js');
var userModel = require('./model/user.js');
const {ipcRenderer} = require('electron');
const remote = require('electron').remote;

var username;
var topNav;

function start(){
	username = ipcRenderer.sendSync('fetch-username');
	topNav = new Vue({
		el:"#top-nav",
		data:{
			username:username
		}
	})
}

window.addEventListener("load", start);