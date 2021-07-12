const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Trainer = require('./models/trainer');

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

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/trainers', async (req, res) => {
    const trainers = await Trainer.find({});
    res.render('trainers/index', { trainers });
});

app.get('/trainers/new', (req, res) => {
    res.render('trainers/new');
});

app.post('/trainers', async (req, res) => {
    const trainer = new Trainer(req.body.trainer);
    await trainer.save();
    res.redirect(`/trainers/${trainer._id}`);
});

app.get('/trainers/:id', async (req, res) => {
    const trainer = await Trainer.findById(req.params.id);
    res.render('trainers/show', { trainer });
});

app.get('/trainers/:id/edit', async (req, res) => {
    const trainer = await Trainer.findById(req.params.id);
    res.render('trainers/edit', { trainer });
});

app.put('/trainers/:id', async (req, res) => {
    const { id } = req.params;
    const trainer = await Trainer.findByIdAndUpdate(id, { ...req.body.trainer });
    res.redirect(`/trainers/${trainer._id}`);
});

app.delete('/trainers/:id', async (req, res) => {
    const { id } = req.params;
    await Trainer.findByIdAndDelete(id);
    res.redirect('/trainers');
});

app.listen(3000, () => {
    console.log('Serving on Port 3000')
})