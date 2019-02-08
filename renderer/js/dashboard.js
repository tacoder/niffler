var init = require('./js/init.js');
var userModel = require('./model/user.js');
var fileProcessors = require('./js/fileprocessors');

const {ipcRenderer} = require('electron');
const remote = require('electron').remote;


var username;
var topNav, fileform;

const supportedFiles=fileProcessors.supportedProcessors;//{0: "icici_credit", 1: "icici_credit_bulk", 2: "icici_debit", 3:"paytm_bank"};

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
				fileProcessors.process(fileform.file.path,fileform.type, function (err,data){
					if(err) alert("Error occurred while processing!" + err);
					else alert("File was successfully processed man , data received from function was" + data);
				});
			}
		}
	})
}

window.addEventListener("load", start);