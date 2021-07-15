const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const Trainer = require('../models/trainer');
const Review = require('../models/review');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const trainer = await Trainer.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    trainer.reviews.push(review);
    await review.save();
    await trainer.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/trainers/${trainer._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Trainer.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted your review!');
    res.redirect(`/trainers/${id}`);
}));

module.exports = router;