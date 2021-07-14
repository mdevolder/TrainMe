const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { trainerSchema, reviewSchema } = require('./schemas.js')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Trainer = require('./models/trainer');
const Review = require('./models/review');

const defaultImage = 'https://source.unsplash.com/-1GI_FL-8Uw/640x1135';

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

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateTrainer = (req, res, next) => {
    const { error } = trainerSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/trainers', catchAsync(async (req, res) => {
    const trainers = await Trainer.find({});
    res.render('trainers/index', { trainers });
}));

app.get('/trainers/new', (req, res) => {
    res.render('trainers/new');
});

app.post('/trainers', validateTrainer, catchAsync(async (req, res) => {
    const trainerInput = req.body.trainer;
    if (!trainerInput.image) trainerInput.image = defaultImage;
    const trainer = new Trainer(trainerInput);
    await trainer.save();
    res.redirect(`/trainers/${trainer._id}`);
}));

app.get('/trainers/:id', catchAsync(async (req, res) => {
    const trainer = await Trainer.findById(req.params.id).populate('reviews');
    res.render('trainers/show', { trainer });
}));

app.get('/trainers/:id/edit', catchAsync(async (req, res) => {
    const trainer = await Trainer.findById(req.params.id);
    res.render('trainers/edit', { trainer });
}));

app.put('/trainers/:id', validateTrainer, catchAsync(async (req, res) => {
    const trainerInput = req.body.trainer
    if (!trainerInput.image) trainerInput.image = defaultImage;
    const { id } = req.params;
    const trainer = await Trainer.findByIdAndUpdate(id, { ...trainerInput });
    res.redirect(`/trainers/${trainer._id}`);
}));

app.delete('/trainers/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Trainer.findByIdAndDelete(id);
    res.redirect('/trainers');
}));

app.post('/trainers/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const trainer = await Trainer.findById(req.params.id);
    const review = new Review(req.body.review);
    trainer.reviews.push(review);
    console.log(trainer);
    await review.save();
    await trainer.save();
    res.redirect(`/trainers/${trainer._id}`);
}));

app.delete('/trainers/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Trainer.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/trainers/${id}`);
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oops, something went wrong!'
    res.status(statusCode).render('error', { err })
});

app.listen(3000, () => {
    console.log('Serving on Port 3000')
})