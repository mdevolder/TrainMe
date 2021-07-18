const Trainer = require('../models/trainer');
const { cloudinary } = require('../cloudinary');

const defaultImage = 'https://source.unsplash.com/-1GI_FL-8Uw/640x1135';

module.exports.index = async (req, res) => {
    const trainers = await Trainer.find({});
    res.render('trainers/index', { trainers });
}

module.exports.renderNewForm = (req, res) => {
    res.render('trainers/new');
}

module.exports.createTrainer = async (req, res, next) => {
    const trainer = new Trainer(req.body.trainer);
    trainer.image = req.file;
    trainer.author = req.user._id;
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
    const { id } = req.params;
    const trainer = await Trainer.findByIdAndUpdate(id, { ...req.body.trainer });
    if (req.file) {
        await cloudinary.uploader.destroy(trainer.image.filename);
        trainer.image = { path: req.file.path, filename: req.file.filename };
        await trainer.save();
    }
    req.flash('success', 'Successfully updated your trainer profile!');
    res.redirect(`/trainers/${trainer._id}`);
}

module.exports.deleteTrainer = async (req, res) => {
    const { id } = req.params;
    const trainer = await Trainer.findByIdAndDelete(id);
    await cloudinary.uploader.destroy(trainer.image.filename);
    req.flash('success', 'Successfully deleted your trainer profile!');
    res.redirect('/trainers');
}