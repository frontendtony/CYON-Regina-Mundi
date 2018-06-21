var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
	email: { type:String, lowercase: true },
	password: String,
	firstname: { type:String, lowercase: true },
	lastname: { type:String, lowercase: true },
	middlename: { type:String, lowercase: true },
	image: { type:String, lowercase: true },
	gender: { type:String, lowercase: true },
	relationshipStatus: { type:String, lowercase: true },
	dateOfBirth: Date,
	phone: String,
	phone2: String,
	address: String,
	address2: String,
	state: { type:String, lowercase: true },
	city: { type:String, lowercase: true },
	localGovernmentOfOrigin: { type:String, lowercase: true },
	isAdmin: { type: Boolean, default: false},
	isExecutive: { type: Boolean, default: false},
	currentPosition: { type: String, lowercase:true, default: 'member'},
	dateJoined: { type: Date, default: Date.now }
});

UserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model('User', UserSchema);