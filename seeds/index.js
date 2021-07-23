require('dotenv').config();
const mongoose = require('mongoose');
const locations = require('./locations');
const { firstNamesMale, firstNamesFemale, lastNames, imagesMale, imagesFemale, descriptions, serviceLocations, services, certifications } = require('./seedHelpers');
const cloudinary = require('cloudinary').v2;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/train-me';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const Trainer = require('../models/trainer');

mongoose.connect(dbUrl, {
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
    //await cloudinary.api.delete_resources(all, {folder: "TrainMe"})
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
            author: '60f778b26514867e90b28303',
            services: sample(services),
            serviceLocation: sample(serviceLocations),
            certification: sample(certifications),
            image: {
                url: img.url,
                filename: img.public_id}
        })
        const geoData = await geocoder.forwardGeocode({
            query: `${train.street} ${train.city}, ${train.state} ${train.zip}`,
            limit: 1
        }).send()
        train.geometry = geoData.body.features[0].geometry;
        await train.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})