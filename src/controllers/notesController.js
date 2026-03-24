import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const notes = await Note.find();

  res.status(200).json(notes);
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(noteId);
};

export const createNote = async (req, res) => {
  const newNote = await Note.create(req.body);

  res.status(201).json(newNote);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const deleteNoteById = await Note.findByIdAndDelete(noteId);

  if (!deleteNoteById) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(deleteNoteById);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const updateNoteById = await Note.findByIdAndUpdate(noteId, req.body, {
    returnDocument: 'after',
  });

  if (!updateNoteById) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(updateNoteById);
};
