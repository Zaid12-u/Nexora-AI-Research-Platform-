import History from "../models/history.model.js";

export const saveHistory = async (req, res) => {
  try {
    const { query, results } = req.body;
    const userId = req.user.id;
    const history = new History({ userId, query, results });
    await history.save();
    res.status(201).json({ message: "History saved!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await History.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json({ history });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    await History.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};