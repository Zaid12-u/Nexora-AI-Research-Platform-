import mongoose from "mongoose";

const paperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    abstract: {
      type: String,
      required: true,
    },
    authors: [String],
    url: {
      type: String,
    },
    published: {
      type: String,
    },
    topic: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number],  // FAISS ke liye vector
    },
  },
  { timestamps: true }
);

// Same topic ke duplicate papers avoid karo
paperSchema.index({ title: 1, topic: 1 }, { unique: true });

export default mongoose.model("Paper", paperSchema);