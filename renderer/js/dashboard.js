var init = require('./js/init.js');
var userModel = require('./model/user.js');
var fileProcessors = require('./js/fileprocessors');

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
			processFile: function(){
				fileProcessors.process(fileform.file.path,fileform.type, function (err,data){
					if(err) alert("Error occurred while processing!" + err);
					else alert("File was successfully processed man , data received from function was" + JSON.stringify(data)) ;
					console.log("data is " + (fileform.type));
					console.log("data is " + JSON.stringify(fileform.file));
					console.log("data is " + JSON.stringify(fileform.file.name));
					// insert into db!
					dataToInsert = {}
					dataToInsert.transactions = data;
					dataToInsert.fileType = fileform.type;
					dataToInsert.processedOn = new Date();
					dataToInsert.fileName = fileform.file.name;
					couch.insert("niffler", dataToInsert).then(({data, headers, status}) => {
					    // data is json response
					    // headers is an object with all response headers
					    // status is statusCode number
					}, err => {
						console.log("Error while inserting into database!")
						console.log(err);
					    // either request error occured
					    // ...or err.code=EDOCCONFLICT if document with the same id already exists
					});

				});
			}
		}
	})
}

window.addEventListener("load", start);