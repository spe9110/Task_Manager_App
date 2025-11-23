import Joi from "joi";

export const createTaskSchema = Joi.object({
    name: Joi.string().min(3).max(100).trim().required(),
    description: Joi.string().max(500).trim().allow('', null).optional(),
    priority: Joi.string().valid('Urgent', 'not urgent').default('not urgent').required(),
    due: Joi.date().required(),
    status: Joi.string().valid('Open', 'Done').default('Open').required(),
});


export const updateTaskSchema = Joi.object({
    name: Joi.string().min(3).max(100).trim().optional(),
    description: Joi.string().max(500).trim().allow('', null).optional(),
    priority: Joi.string().valid('Urgent', 'not urgent').optional(),
    due: Joi.date().optional(),
    status: Joi.string().valid('Open', 'Done').optional(),
});
