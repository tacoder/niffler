const tabula = require('tabula-js');
const date = /\d+\ \w+\ 20\d{2}.*/g;
function splitCsv(str) {
  return str.split(',').reduce((accum,curr)=>{
    if(accum.isConcatting) {
      accum.soFar[accum.soFar.length-1] += ','+curr
    } else {
      accum.soFar.push(curr)
    }
    if(curr.split('"').length % 2 == 0) {
      accum.isConcatting= !accum.isConcatting
    }
    return accum;
  },{soFar:[],isConcatting:false}).soFar
}

function isFooter(line){
	return line.startsWith('To view terms & conditions visit htt')
	|| line.startsWith('Need Help? Call us at 0120 4456 456 or visit  http://www.paytmbank.com')
	|| line.startsWith('"**** THIS IS COMPUTER GENERATED DOCUMENT WHICH REQUIRES NO SIGNATURE AND REPRESENTS YOUR RECORD ');
}

function startsWithDate(line){
	return line.match(date)
}

function extractFromToDatesFromLine(str) {
	// Looks somethign like
	// Account statement for: 25 January 2018 to 12 January 2019,ACCOUNT OPENED ON: 25th Jan 2018
	//                        ^                                 ^   
	// So we get string from  ^ This 23th charachter, till the first comma seen
	return str.substr(23, str.indexOf(',') - 23)
}

function rawTransactionDataToJson(lines){
	// The first line always should contain the date. followed by title, then amount transacted and available amount
	// The third line typically contains the time.
	// The rest is recorded as comments to be parsed later on.
	if(!startsWithDate(lines[0])){
		console.log ("possibly corrupt record - unable to find date here." + JSON.stringify(lines));
		return {error: "first line does not contain date in the start!" , raw_transaction_records : lines}
	}
	if(lines.length < 3) {
		console.log ("possibly corrupt record - unable to find time here." + JSON.stringify(lines));
		return {error:"<3 rows in transaction record" , raw_transaction_records : lines}
	}
	var transaction_data = {}
	var firstLine = lines[0];

	var justDate = /\d+\ \w+\ 20\d{2}/g;
	transaction_data.date = firstLine.match(justDate)[0]
	var amountRegex = /[-+]\ ₹[\d,]+\.\d{2}"?[,\ ]+"?₹[\d,]+\.\d{2}/g;
	var amountString = firstLine.match(amountRegex)[0];
	transaction_data.amount = amountString.match(/[-+]\ ₹[\d,]+\.\d{2}/g)[0]
	transaction_data.availableBalance = amountString.substr(3).match(/₹[\d,]+\.\d{2}/g)[0]
	transaction_data.transaction_type = firstLine.split(',')[0].substr(transaction_data.date.length)

	var thirdLine = lines[2];
	transaction_data.time = thirdLine.match(/\d+:\d+\ \w+/g)[0]

	// start iterating from second line and gobble everything up as comments!.
	var itr = 1;
	transaction_data.comments = []
	while(itr < lines.length){
		if(itr == 2) {
			transaction_data.comments.push(lines[itr].substr(transaction_data.time.length))
		} else {
			transaction_data.comments.push(lines[itr])
		}
		itr++;
	}
	return transaction_data;
}

function extractBillData(data) {
	var itr = 0;
	var jsonData = {}
	jsonData.meta = {}
	jsonData.raw_transaction_records = []
	while(itr < data.length){
		var line = data[itr]
		if(line.startsWith('Account statement for')) {
			jsonData.meta.from_to = extractFromToDatesFromLine(line)
		} else if (startsWithDate(line)) {
			var transaction_record_lines = []
			do {
				transaction_record_lines.push(line)
				itr ++
				line = data[itr]
			} while (line && (!startsWithDate(line) && !isFooter(line)))
			jsonData.raw_transaction_records.push(rawTransactionDataToJson(transaction_record_lines));
			continue;
		}
		itr ++
	}
	return jsonData;
}

function fileToJson(filePath, cb) {
	const t = tabula(filePath,{pages:"all",silent:true});
	t.extractCsv((err, data) => {
		if(err) cb(err); 
		else {
			cb(null, extractBillData(data))
		}
	});

}

module.exports={fileToJson:fileToJson}
