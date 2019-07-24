/*
This package contains all base transaction related functions!

Base transaction 
  DateTime
  Amount +ve or -ve incates money spent and received resp
  SourceFileDataId
  SourceRawData
  BillerId


Biller details
  BillerId
  biller name
  biller type
  biller aliases {"File type": alias}

*/

module.exports = {
	transaction : function(SourceRawData, DateTime, amount, billerRawName) {
		var t = {};
		t.DateTime = DateTime;
		t.amount = amount;
		t.SourceRawData = SourceRawData;
		t.billerRawName = billerRawName;
		return t;  
	}

}

/*

icici credit
{
      "date": "12/11/2018",
      "ref_number": "",
      "transaction_details": "Autodebit Payment Recd.",
      "reward_points": "",
      "currency": "",
      "international_amount": "",
      "amount": "\"7,374.82 CR\""
}


paytm bank
  {
    "date": "12 Feb 2018",
    "amount": "+ ₹1.00",
    "availableBalance": "₹1.00",
    "transaction_type": " Money Received",
    "time": "5:19 AM",
    "comments": [
      "Received from: ABHINAV SINGH,",
      ",",
      "Transaction ID: M1458,",
      "IMPS Reference  No: 804305060531,"
    ]
  },

icici debit:
  {
    "s_no": "1",
    "value_date": "02/12/2018",
    "transaction_date": "03/12/2018",
    "cheque_number": "-",
    "transaction_remarks": "ATM/CASH WDL/02-12-18/0                           ",
    "withdrawal": 1500,
    "deposit": 0,
    "balance": 11192.25
  },


Base transaction 
  DateTime
  Amount +ve or -ve incates money spent and received resp
  SourceFileDataId
  SourceRawData
  BillerId


Biller details
  BillerId
  biller name
  biller type
  biller aliases {"File type": alias}

  */