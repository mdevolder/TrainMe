const mongoose = require('mongoose');
const locations = require('./locations');
const {firstNames, lastNames} = require('./seedHelpers');

const Trainer = require('../models/trainer');

mongoose.connect('mongodb://localhost:27017/train-me', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Trainer.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomLoc = Math.floor(Math.random() * locations.length);
        const train = new Trainer({
            firstName: sample(firstNames),
            lastName: sample(lastNames),
            street: locations[randomLoc].street,
            street2: locations[randomLoc].street2,
            city: locations[randomLoc].city,
            state: locations[randomLoc].state,
            zip: locations[randomLoc].zip
        })
        await train.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})