var postProcessor = require('./postProcessor.js');

function fileRawDataToDbRawData(fileRawData, fileType, fileName){
	var dataToInsert = {}
	dataToInsert.transactions = fileRawData;
	dataToInsert.fileType = fileform.type;
	dataToInsert.processedOn = new Date();
	dataToInsert.fileName = fileform.file.name;
	return dataToInsert;
}

function insertRawDataIntoRawDb(dataToInsert, cb) {
	// insert into db!
	couch.insert("nf_raw_tx_data", dataToInsert).then(({data, headers, status}) => {
		console.log("After insertion in db: data received is " + JSON.stringify(data) + ", headers are: " + JSON.stringify(headers) + ", status is " + JSON.stringify(status));
	    // Successfully inserted raw data into raw repo.
	    // Now iterate over all objects, convert them into transaction, then move to central database.
	    // Case in point keep sure duplicates are not inserted. This operation is central, so code must be central as well.
	    // Call common function here to convert them into base transacton.
	    
	    // Each processor must implement a "convert to base transaction function."

	    // Perform deduplication - exact File name match, exact file hash match
	    // Perform low level de duplication - By checking base transactions existing in the system!
	    cb(null, data)
	}, err => {
		console.log("Error while inserting into database!")
		console.log(err);
		cb(err);
	});
}


function processFile(){
	var fileProcessor = fileProcessors.getProcessor(fileform.type);
	fileProcessors.process(fileform.file.path, fileProcessor, function (err,data){
		if(err) {
			console.log(err)
			// what do ?
			// Alert user on issue ?
			alert("Unable to process, please try again later.");
		} else {
			var dataToInsert = fileRawDataToDbRawData(data);
			insertRawDataIntoRawDb(dataToInsert, (err, res) => {
				console.log("After inserting to db res is " + JSON.stringify(res));
				console.log("After inserting to db, data is " + JSON.stringify(data));
				console.log("After inserting to db, dataToInsert is " + JSON.stringify(dataToInsert));
				if(err) {
					alert("Unable to process, please try again later.");
				} else {
					postProcessor.postProcess(res.id, dataToInsert, function(err, data) {
						if(err) {
							console.log(err);
							alert("Failed at post processing steps!");
						} else {
							alert("Successfully inserted records");
						}
					});
					// Check deduplications - exact File name match, exact file hash match
					// Else proceed to post processing step
					
				}
			});
		}
	});
}

module.exports = {
	"processFile" : processFile
}