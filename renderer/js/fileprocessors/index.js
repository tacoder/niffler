const processors = {0: "icici_credit", 1: "icici_credit_bulk", 2: "icici_debit", 3:"paytm_bank"};

module.exports = {
	process : function processFn(filePath, fileType, cb){
		require('./' + processors[fileType]).fileToJson(filePath, function (err,data){
			cb(err,data);
		});	
	} ,
	supportedProcessors: processors,
	common : require('./common.js')
}