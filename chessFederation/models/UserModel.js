/**
 * Created by sobolrr on 22.05.16.
 */
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true},
    role: String,
    firstName: String,
    lastName:String,
    email: String,
    sex: String,
    country: String,
    city: String,
    rank: String,
    registeredAt: { type: Date, expires: 60*60*24 },

    hash: String,
    salt: String
});

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

    return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        _id: this.id,
        username: this.username,
        role: this.role,
        firstName: this.firstName,
        secondName: this.lastName,
        email: this.email,
        sex: this.sex,
        country: this.country,
        city: this.city,
        rank: this.rank,
        registeredAt: this.cregisteredAt,
    exp: parseInt(exp.getTime() / 1000)
    },'SECRET');
};

mongoose.model('User', UserSchema);