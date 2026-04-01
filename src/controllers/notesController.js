import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 15, tag, search, title, content } = req.query;
  const skip = (page - 1) * perPage;

  const notesQuery = Note.find();

  if (search) {
    notesQuery.where({$text: { $search: search } });
  }
  if (tag) {
    notesQuery.where({ tag });
  }

  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({ page, perPage, totalNotes, totalPages, notes });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
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
