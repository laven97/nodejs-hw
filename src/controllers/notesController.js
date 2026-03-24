import createHttpError from 'http-errors';
import { NoteSchema } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const notes = await NoteSchema.find();

  res.status(200).json(notes);
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const noteById = await NoteSchema.findById(noteId);

  if (!noteById) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(noteById);
};

export const createNote = async (req, res) => {
  const newNote = await NoteSchema.create(req.body);

  res.status(200).json(newNote);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const deleteNote = await NoteSchema.deleteOne(noteId);

  if (!deleteNote) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(deleteNote);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const updateNote = await NoteSchema.updateOne(noteId, req.body, {
    returnDocument: 'after',
  });

  if (!updateNote) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(updateNote);
};
