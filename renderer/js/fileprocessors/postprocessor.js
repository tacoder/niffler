
function convertToBaseTransactions(fileProcessor,  data){
	baseTransactions = []
	for (var i = 0; i < data.length; i++) {
		baseTransactions.push(fileProcessor.rawToBasicTransaction(data[i]));
	}
	return baseTransactions;
}

function addMetaData(baseTxns, fileType, uploadId) {
	for (var i = baseTxns.length - 1; i >= 0; i--) {
		baseTxns[i].fileType = fileType;
		baseTxns[i].uploadId = uploadId;	
	}
}

function insertIntoBaseDatabase(transactions, cb){
	failed = 0;
	for (var i = transactions.length - 1; i >= 0; i--) {
		var transaction = transactions[i];
		console.log("Inserting: " + JSON.stringify(transaction))
		couch.insert("nf_base_tx_data", transaction).then(({data, headers, status}) => {
			//console.log("After insertion in db: data received is " + JSON.stringify(data) + ", headers are: " + JSON.stringify(headers) + ", status is " + JSON.stringify(status));
		    // Successfully inserted raw data into raw repo.
		    // Now iterate over all objects, convert them into transaction, then move to central database.
		    // Case in point keep sure duplicates are not inserted. This operation is central, so code must be central as well.
		    // Call common function here to convert them into base transacton.
		    
		    // Each processor must implement a "convert to base transaction function."

		    // Perform deduplication - exact File name match, exact file hash match
		    // Perform low level de duplication - By checking base transactions existing in the system!
		    //cb(null, data)
		}, err => {
			console.log("Error while inserting into database!" + err + " , While inserting ");
			failed += 1;
		});
	}
	if (failed > 0) {
		cb (new Error("Failed to insert " + failed + " records"));
	} else {
		cb();
	}

}

function postProcessFn(uploadId, rawDataInserted, cb) {
	var fileType = rawDataInserted.fileType;
	var fileProcessor = fileProcessors.getProcessor(fileform.type);
	var baseTxns = convertToBaseTransactions(fileProcessor, rawDataInserted.transactions.rawData);
	addMetaData(baseTxns, fileType, uploadId);
	// Check deduplications - Base db should not contain exact matching transactions.
	insertIntoBaseDatabase(baseTxns, cb);
}

module.exports = {
	/*
	 * Data that was extracted from file shall be put into base database here:
	 */
	postProcess: postProcessFn
}
