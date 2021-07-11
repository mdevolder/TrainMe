const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrainerSchema = new Schema({
    firstName: String,
    lastName: String,
    description: String,
    street: String,
    street2: String,
    city: String,
    state: String,
    zip: Number
});

module.exports = mongoose.model('Trainer', TrainerSchema);