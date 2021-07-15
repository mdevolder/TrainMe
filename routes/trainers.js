const express = require('express');
const router = express.Router();

const Trainer = require('../models/trainer');

const { trainerSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const defaultImage = 'https://source.unsplash.com/-1GI_FL-8Uw/640x1135';

const validateTrainer = (req, res, next) => {
    const { error } = trainerSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const trainers = await Trainer.find({});
    res.render('trainers/index', { trainers });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('trainers/new');
});

router.post('/', isLoggedIn, validateTrainer, catchAsync(async (req, res, next) => {
    const trainerInput = req.body.trainer;
    if (!trainerInput.image) trainerInput.image = defaultImage;
    const trainer = new Trainer(trainerInput);
    await trainer.save();
    req.flash('success', 'Successfully added your trainer profile!');
    res.redirect(`/trainers/${trainer._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const trainer = await Trainer.findById(req.params.id).populate('reviews');
    if (!trainer) {
        req.flash('error', 'Cannot find that trainer!');
        return res.redirect('/trainers');
    }
    res.render('trainers/show', { trainer });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
        req.flash('error', 'Cannot find that trainer!');
        return res.redirect('/trainers');
    }
    res.render('trainers/edit', { trainer });
}));

router.put('/:id', isLoggedIn, validateTrainer, catchAsync(async (req, res) => {
    const trainerInput = req.body.trainer
    if (!trainerInput.image) trainerInput.image = defaultImage;
    const { id } = req.params;
    const trainer = await Trainer.findByIdAndUpdate(id, { ...trainerInput });
    req.flash('success', 'Successfully updated your trainer profile!');
    res.redirect(`/trainers/${trainer._id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Trainer.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted your trainer profile!');
    res.redirect('/trainers');
}));

module.exports = router;