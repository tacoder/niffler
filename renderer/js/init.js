var mongo_helper = require('./mongo_helper');
var Q = require('q')

module.exports = {
	initialize : function(cb){
		mongo_helper.initialize(function(error) {
			if(error) cb(error);
				else cb()
		});

		// Q.all(mongo_helper.initialize)
		// .then(function() {
		// 	cb();
		// })
		// .catch(function(err){
		// 	cb(err);
		// });
		// mongo_helper.initialize();
	}
	// function(uri, cb) {
	// 	mongoose.connect(uri, function(error) {
	// 		if(error) cb(error);
 //  			cb()
	// 	})
	// }
}