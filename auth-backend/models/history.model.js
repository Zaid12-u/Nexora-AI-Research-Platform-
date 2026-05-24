import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    results: [
      {
        title: String,
        abstract: String,
        authors: [String],
        url: String,
        published: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("History", historySchema);