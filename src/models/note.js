import { model, Schema } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true, 
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    tag: {
      type: String,
      enum: [
        "Work",
        "Personal",
        "Meeting",
        "Shopping",
        "Ideas",
        "Travel",
        "Finance",
        "Health",
        "Important",
        "Todo",
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const NoteSchema = model("Note", noteSchema);
