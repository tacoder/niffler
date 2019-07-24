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

function loadTransactions(cb){
	couch.mango("nf_base_tx_data", {"selector":{}}).then(({data, headers, status}) => {
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
	username = ipcRenderer.sendSync('fetch-username');
	topNav = new Vue({
		el:"#top-nav",
		data:{
			username:username,
			transactions:transactions
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
	});
	trans = new Vue({
		el:"#transactions",
		data:{
			transactions:[{"DateTime":"ASdfs"}]
		},
		methods:{
			// storeSelectedFileName: function(selectedFile) {
			// 	fileform.file = selectedFile.target.files[0];
			// },
			// processFile: commonProcessor.processFile
		}
	})
	loadTransactions(function(err, data){
		if (err) alert(err);
		else trans.transactions = data;
	});
}

window.addEventListener("load", start);