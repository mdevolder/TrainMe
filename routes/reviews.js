const express = require('express');
const router = express.Router({ mergeParams: true });

const Trainer = require('../models/trainer');
const Review = require('../models/review');

const { reviewSchema } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const trainer = await Trainer.findById(req.params.id);
    const review = new Review(req.body.review);
    trainer.reviews.push(review);
    await review.save();
    await trainer.save();
    res.redirect(`/trainers/${trainer._id}`);
}));
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Trainer.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/trainers/${id}`);
}));

module.exports = router;