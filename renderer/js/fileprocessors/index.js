const processors = {0: "icici_credit", 1: "icici_credit_bulk", 2: "icici_debit", 3:"paytm_bank"};

module.exports = {
	process : (filePath, fileProcessor, cb) => {
		fileProcessor.fileToJson(filePath, function (err,data){
			cb(err,data);
		});	
	},
	getProcessor: (fileType) => {
		return require('./' + processors[fileType]);
	},
	supportedProcessors: processors,
	common : require('./common.js')
}

/*
Required functions to be implemented by each processor:
fileToJson
rawToBasicTransaction
*/