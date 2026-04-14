import { Segments, Joi } from 'celebrate';
import { isValidObjectId } from 'mongoose';

import { TAGS } from '../constants/tags.js';


export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().min(1).default(1),
    perPage: Joi.number().min(5).max(20).default(10),
    tag: Joi.string().valid(...TAGS),
    search: Joi.string().allow(''),
  }),
};

const objectValidator = (value, helpers) => {
  return isValidObjectId(value) ? value : helpers.message('Bad id format');
};

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectValidator).required(),
  }),
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().allow(''),
    tag: Joi.string().valid(...TAGS),
  }),
};

export const updateNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1),
    content: Joi.string().allow(''),
    tag: Joi.string().valid(...TAGS),
  }).min(1),
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectValidator).required(),
  }),
};
