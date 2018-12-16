var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
	name:'string'
});

module.exports=mongoose.model('User', userSchema);