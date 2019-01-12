const date = /\d{2}\/\d{2}\/\d{4}.*/g;
const tabula = require('tabula-js');
var password = require('./pass.js');

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

function extractBillData(data) {
	var itr = 0;
	var jsonData = []
	while(itr < data.length){
		// Ignore lines until we see this string.
		while(itr < data.length && !data[itr].startsWith('"",Amount(in|),,,,,')){
			itr ++;
		}
		// Skip this string as well, because the next line is always a record.
		itr += 1
		// Keep reading lines till we see a date at the beginning.
		while(itr < data.length && data[itr].match(date)){
			row = splitCsv(data[itr])
			var datum = {}
			datum.date = row[0];
			datum.ref_number = row[1];
			datum.transaction_details = row[2];
			datum.reward_points = row[3];
			datum.currency = row[4];
			datum.international_amount = row[5];
			datum.amount = row[6];
			jsonData.push(datum)
			itr ++;
		}
	}
	return jsonData;
}

function fileToJson(filePath, cb) {
	const t = tabula(filePath,{pages:"all",password:password,silent:true});
	t.extractCsv((err, data) => {
		if(err) cb(err); 
		else {
			cb(null, extractBillData(data))
		}
	});

}

module.exports={fileToJson:fileToJson}
