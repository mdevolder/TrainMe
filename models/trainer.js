const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.path.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const TrainerSchema = new Schema({
    firstName: {type: String, trim: true},
    lastName: {type: String, trim: true},
    description: {type: String, trim: true},
    street: {type: String, trim: true},
    street2: {type: String, trim: true},
    city: {type: String, trim: true},
    state: {type: String, trim: true},
    zip: {type: String, trim: true},
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    image: ImageSchema,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

TrainerSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/trainers/${this._id}">${this.firstName} ${this.lastName}</a></strong>`
});

TrainerSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Trainer', TrainerSchema);