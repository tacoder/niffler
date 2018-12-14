var config = require("./config");
var mongoose = require('mongoose')

module.exports = {
	initialize : function(cb) {
		mongoose.connect(config.mongo.url,{ useNewUrlParser: true }).then(
		() => {
					console.log("connected to " + config.mongo.url + " and error receinved ti s");
  			cb();},
  			error =>

				{console.log(error);cb(error);}
		)
	}

}