const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

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
            .required()
            .escapeHTML(),
        lastName: Joi
            .string()
            .trim()
            .required()
            .escapeHTML(),
        description: Joi
            .string()
            .trim()
            .required()
            .escapeHTML(),
        street: Joi
            .string()
            .trim()
            .required()
            .escapeHTML(),
        street2: Joi
            .string()
            .trim()
            .allow('', null)
            .escapeHTML(),
        city: Joi
            .string()
            .trim()
            .required()
            .escapeHTML(),
        state: Joi
            .string()
            .trim()
            .required()
            .valid(...states)
            .escapeHTML(),
        zip: Joi
            .string()
            .trim()
            .regex(/^[0-9]{5}(?:-[0-9]{4})?$/)
            .required()
            .escapeHTML(),
    }).required(),
    services: Joi
        .array()
        .items(Joi.string().escapeHTML()),
    serviceLocation: Joi
        .array()
        .items(Joi.string().escapeHTML()),
    certification: Joi
        .array()
        .items(Joi.string().escapeHTML())
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        body: Joi.string().trim().required().escapeHTML()
    }).required()
});