const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

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
    image: {
        path: String,
        filename: String
    },
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