let qpdf = require('../qpdf');
var password = require('pass.js');
function fileToJson(filePath, cb){
	var outputFilePath = filePath += ".decryped"
	qpdf.decrypt(filePath, "abhi0210",outputFilePath,function (err,data) {
		if(err) cb(err);
		else {
			// File is unencrypted and saved in outputFilePath. MUST delete this.
				
		}
	})

}

// qpdf.decrypt("/Users/tacoder/Downloads/4375 XXXX XXXX 7001-767099.pdf", "abhi0210","/Users/tacoder/Downloads/statement.pdf",function (err,data) {console.log(err);console.log(data)})
