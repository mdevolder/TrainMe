const express = require('express');
const router = express.Router();
const trainers = require('../controllers/trainers');
const { isLoggedIn, isAuthor, validateTrainer } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const Trainer = require('../models/trainer');

router.route('/')
    .get(catchAsync(trainers.index))
    .post(isLoggedIn, validateTrainer, catchAsync(trainers.createTrainer));

router.get('/new', isLoggedIn, trainers.renderNewForm);

router.route('/:id')
    .get(catchAsync(trainers.showTrainer))
    .put(isLoggedIn, isAuthor, validateTrainer, catchAsync(trainers.updateTrainer))
    .delete(isLoggedIn, isAuthor , catchAsync(trainers.deleteTrainer));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(trainers.renderEditForm));

module.exports = router;