const Joi = require('joi');
//const Extension = require('joi-us-zipcode');
//const Joi = BaseJoi.extend(Extension);

const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
    'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Missouri', 
    'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 
    'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
    'Wisconsin', 'Wyoming', 'District of Columbia']

module.exports.trainerSchema = Joi.object({
    trainer: Joi.object({
        firstName: Joi
            .string()
            .trim()
            .required(),
        lastName: Joi
            .string()
            .trim()
            .required(),
        description: Joi
            .string()
            .trim()
            .required(),
        street: Joi
            .string()
            .trim()
            .required(),
        street2: Joi
            .string()
            .trim()
            .allow('', null),
        city: Joi
            .string()
            .trim()
            .required(),
        state: Joi
            .string()
            .trim()
            .required()
            .valid(...states),
        zip: Joi
            .string()
            .trim()
            .regex(/^[0-9]{5}(?:-[0-9]{4})?$/)
            .required(),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        body: Joi.string().trim().required()
    }).required()
});