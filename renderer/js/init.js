var mongoose = require('mongoose')

module.exports = {
	initialize : function(uri, cb) {
		mongoose.connect(uri, function(error) {
			if(error) cb(error);
  			cb()
		})
	}
}