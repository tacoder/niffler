var XLSX = require('xlsx');

function fileToJson(filePath, cb){
	var sheetData = {}
	var sheet = XLSX.readFile(filePath).Sheets['OpTransactionHistory'];
	var totalRows = sheet['!rows'].length;
	var startTableRow = 14; // 12 rows contain initial info about search.
	var endTableRow = totalRows - 27; // 27 spaces taken up by legend. Can vary later, so fix it later

	sheetData.meta = {}
	sheetData.meta.uploadedFile = filePath;
	sheetData.meta.uploadedDate = new Date().toString();
	sheetData.meta.searchFromDate = sheet.D5.v;
	sheetData.meta.searchToDate = sheet.F5.v;

	sheetData.rawData = []
	for (var rowNum = startTableRow; rowNum < endTableRow; rowNum++) {
		rowData = {}
		rowData['s_no'] = sheet['B' + rowNum].v	
		rowData['value_date'] = sheet['C' + rowNum].v	
		rowData['transaction_date'] = sheet['D' + rowNum].v	
		rowData['cheque_number'] = sheet['E' + rowNum].v	
		rowData['transaction_remarks'] = sheet['F' + rowNum].v	
		rowData['withdrawal'] = sheet['G' + rowNum].v
		rowData['deposit'] = sheet['H' + rowNum].v
		rowData['balance'] = sheet['I' + rowNum].v
		sheetData.rawData.push(rowData)
	}
	cb(null,sheetData)
}

/*
sample 
{
    "s_no": "1",
    "value_date": "02/12/2018",
    "transaction_date": "03/12/2018",
    "cheque_number": "-",
    "transaction_remarks": "ATM/CASH WDL/02-12-18/0                           ",
    "withdrawal": 1500,
    "deposit": 0,
    "balance": 11192.25
}
*/
function rawToBasicTransaction(rawData) {
	basicTransaction = {}
	basicTransaction.amount = rawData.withdrawal - rawData.deposit;
	basicTransaction.date = new Date (rawData.value_date);
	basicTransaction.biller_info = rawData.transaction_remarks;
	return basicTransaction;
}

module.exports={fileToJson:fileToJson, rawToBasicTransaction:rawToBasicTransaction}




