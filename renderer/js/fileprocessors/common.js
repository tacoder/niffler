
function fileRawDataToDbRawData(fileRawData){
	var dataToInsert = {}
	dataToInsert.transactions = fileRawData;
	dataToInsert.fileType = fileform.type;
	dataToInsert.processedOn = new Date();
	dataToInsert.fileName = fileform.file.name;
	return dataToInsert;
}

function processFile(){
	fileProcessors.process(fileform.file.path,fileform.type, function (err,data){
		if(err) {alert("Error occurred while processing!" + err);console.log(err)}
		else {alert("File was successfully processed man , data received from function was" + JSON.stringify(data)) ;
			// insert into db!
			// dataToInsert = {}
			// dataToInsert.transactions = data;
			// dataToInsert.fileType = fileform.type;
			// dataToInsert.processedOn = new Date();
			// dataToInsert.fileName = fileform.file.name;
			var dataToInsert = fileRawDataToDbRawData(data);
			couch.insert("nf_raw_tx_data", dataToInsert).then(({data, headers, status}) => {
			    // data is json response
			    // headers is an object with all response headers
			    // status is statusCode number

			    // Successfully inserted raw data into raw repo.
			    // Now iterate over all objects, convert them into transaction, then move to central database.
			    // Case in point keep sure duplicates are not inserted. This operation is central, so code must be central as well.
			    dataToInsert
			}, err => {
				console.log("Error while inserting into database!")
				console.log(err);
			    // either request error occured
			    // ...or err.code=EDOCCONFLICT if document with the same id already exists
			});
		}
	});
}

module.exports = {
	"processFile" : processFile
}