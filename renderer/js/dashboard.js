var init = require('./js/init.js');
var userModel = require('./model/user.js');
var fileProcessors = require('./js/fileprocessors');
var commonProcessor = fileProcessors.common;
const {ipcRenderer} = require('electron');
const remote = require('electron').remote;

const NodeCouchDb = require('node-couchdb');
 
// node-couchdb instance with default options
const couch = new NodeCouchDb();


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
			processFile: commonProcessor.processFile
		}
	})
}

window.addEventListener("load", start);