const Trainer = require('../models/trainer');

const defaultImage = 'https://source.unsplash.com/-1GI_FL-8Uw/640x1135';

module.exports.index = async (req, res) => {
    const trainers = await Trainer.find({});
    res.render('trainers/index', { trainers });
}

module.exports.renderNewForm = (req, res) => {
    res.render('trainers/new');
}

module.exports.createTrainer = async (req, res, next) => {
    const trainerInput = req.body.trainer;
    if (!trainerInput.image) trainerInput.image = defaultImage;
    trainerInput.author = req.user._id;
    const trainer = new Trainer(trainerInput);
    await trainer.save();
    req.flash('success', 'Successfully added your trainer profile!');
    res.redirect(`/trainers/${trainer._id}`);
}

module.exports.showTrainer = async (req, res) => {
    const trainer = await Trainer.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!trainer) {
        req.flash('error', 'Cannot find that trainer!');
        return res.redirect('/trainers');
    }
    res.render('trainers/show', { trainer });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const trainer = await Trainer.findById(id);
    if (!trainer) {
        req.flash('error', 'Cannot find that trainer!');
        return res.redirect('/trainers');
    }
    res.render('trainers/edit', { trainer });
}

module.exports.updateTrainer = async (req, res) => {
    const trainerInput = req.body.trainer
    if (!trainerInput.image) trainerInput.image = defaultImage;
    const { id } = req.params;
    const trainer = await Trainer.findByIdAndUpdate(id, { ...trainerInput });
    req.flash('success', 'Successfully updated your trainer profile!');
    res.redirect(`/trainers/${trainer._id}`);
}

module.exports.deleteTrainer = async (req, res) => {
    const { id } = req.params;
    await Trainer.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted your trainer profile!');
    res.redirect('/trainers');
}