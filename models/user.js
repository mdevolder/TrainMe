const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-type-email');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);