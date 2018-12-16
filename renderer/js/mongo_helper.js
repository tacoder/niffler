var config = require("./config");
var mongoose = require('mongoose')

module.exports = {
	initialize : function(cb) {
		mongoose.connect(config.mongo.url,{ useNewUrlParser: true }).then(
		() => {
					
  			cb();},
  			error =>

				{console.log(error);cb(error);}
		)
	}

}