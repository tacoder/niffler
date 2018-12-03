var config = require("./config");
var mongoose = require('mongoose')

module.exports = {
	initialize : function(cb) {
		mongoose.connect(config.mongo.url, function(error) {
			if(error) 

				{console.log(error);cb(error);}
  			cb()
		})
	}

}