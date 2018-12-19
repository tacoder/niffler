var init = require('./js/init.js');
var userModel = require('./model/user.js');

const {ipcRenderer} = require('electron');
const remote = require('electron').remote;


var username;
var topNav, fileform;

const supportedFiles={0: "paytm", 1: "icico", 2: "mobikwik"};

function start(){
	username = ipcRenderer.sendSync('fetch-username');
	topNav = new Vue({
		el:"#top-nav",
		data:{
			username:username
		}
	});
	fileform = new Vue({
		el:"#form",
		data:{
			type:'',
			file:'',
			fileTypes:supportedFiles
		},
		methods:{
			storeSelectedFileName: function(selectedFile) {
				fileform.file = selectedFile.target.files[0];
			},
			processFile: function(){
				require('./js/fileprocessors')(fileform.file.path,fileform.type);
			}
		}
	})
}

window.addEventListener("load", start);