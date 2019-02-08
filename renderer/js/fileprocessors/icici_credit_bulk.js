const date = /\d{2}-\w+-\d{4}.*/g;
var XLSX = require('xlsx');

function sheetAbhiBaakiHai(sheet, itr) {
	return typeof sheet['B'+itr] == 'undefined' || sheet['B'+itr].v != 'Important Messages';
}

function yeDateHai(sheet, itr){
	return typeof sheet['B'+itr] != 'undefined' && sheet['B' + itr].v.match(date)
}

function sheetStartHoneWaliHai(sheet,itr){
	return typeof sheet['B'+itr] != 'undefined' && sheet['B' + itr].v == "TRANSACTION DETAILS"
}
function fileToJson(filePath, cb){
	var sheetData = {}
	var sheet = XLSX.readFile(filePath).Sheets['Sheet'];
	// var totalRows = sheet['!rows'].length;
	var startTableRow = 20; // rows contain initial info about search.

	sheetData.meta = {}
	sheetData.meta.uploadedFile = filePath;
	sheetData.meta.uploadedDate = new Date().toString();
	sheetData.meta.statement_period = sheet.D18.v;

	sheetData.rawData = []

	var itr = startTableRow;

	// Loop till we reach end of sheet.
	while (sheetAbhiBaakiHai(sheet, itr)) {
		// Skip rows till we reach start of transaction details
		while(sheetAbhiBaakiHai(sheet, itr) && !sheetStartHoneWaliHai(sheet, itr)) {
			itr ++;
		}
		// Skip rows till date start appearing
		while( sheetAbhiBaakiHai(sheet, itr) && !yeDateHai(sheet,itr) ) {
			itr ++;
		}
		// Gobble up all rows with dates, as they are transaction records
		while(sheetAbhiBaakiHai(sheet, itr) && yeDateHai(sheet,itr)) {
			rowData = {}
			rowData['date'] = sheet['B' + itr].v	
			rowData['ref_number'] = sheet['C' + itr].v	
			rowData['transaction_details'] = sheet['D' + itr].v	
			rowData['currency'] = sheet['E' + itr].v	
			rowData['international_amount'] = sheet['F' + itr].v	
			rowData['amount'] = sheet['G' + itr].v
			sheetData.rawData.push(rowData)
			itr ++;
		}
	}
	cb(null,sheetData)
}

// fileToJson("/Users/tacoder/Downloads/CCard_Past_PdfStmt.jsp.xls",function(err,data) {
// 	if(err) console.log(err);
// 	console.log(JSON.stringify(data));
// });
module.exports={fileToJson:fileToJson}


