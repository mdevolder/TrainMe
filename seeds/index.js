require('dotenv').config();
const mongoose = require('mongoose');
const locations = require('./locations');
const { firstNamesMale, firstNamesFemale, lastNames, imagesMale, imagesFemale, descriptions } = require('./seedHelpers');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

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
        const gender = Math.floor(Math.random() * 2);
        const img = await cloudinary.uploader.upload(`https://source.unsplash.com/${gender ? sample(imagesMale) : sample(imagesFemale)}`, {folder: "TrainMe"});
        const train = new Trainer({
            firstName: gender ? sample(firstNamesMale) : sample(firstNamesFemale),
            lastName: sample(lastNames),
            street: locations[randomLoc].street,
            street2: locations[randomLoc].street2,
            city: locations[randomLoc].city,
            state: locations[randomLoc].state,
            zip: locations[randomLoc].zip,
            description: sample(descriptions),
            author: '60f03a8024c78712df801c9f',
            image: {
                path: img.url,
                filename: img.public_id}
        })

        await train.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})