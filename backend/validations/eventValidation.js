import Joi from "joi";

export const createEventSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().allow(""),
  date: Joi.date().required(),
  venue: Joi.string().required(),
  capacity: Joi.number().integer().min(1).required(),
  deadline: Joi.date().required()
});