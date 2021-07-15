const express = require('express');
const router = express.Router();
const trainers = require('../controllers/trainers');
const { isLoggedIn, isAuthor, validateTrainer } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const Trainer = require('../models/trainer');

router.get('/', catchAsync(trainers.index));

router.get('/new', isLoggedIn, trainers.renderNewForm);

router.post('/', isLoggedIn, validateTrainer, catchAsync(trainers.createTrainer));

router.get('/:id', catchAsync(trainers.showTrainer));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(trainers.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateTrainer, catchAsync(trainers.updateTrainer));

router.delete('/:id', isLoggedIn, isAuthor , catchAsync(trainers.deleteTrainer));

module.exports = router;