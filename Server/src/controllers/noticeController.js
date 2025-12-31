import Notice from "../models/Notice.js";

export const getAllNoticesAdmin = async (req, res) => {
  try {
    const notices = await Notice.find()
      .sort({ createdAt: -1 });

    res.status(200).json(notices);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notices" });
  }
};

export const addNotice = async (req, res) => {
  try {
    const { title, tag, link } = req.body;

    const notice = new Notice({ title, tag, link });
    await notice.save();

    res.status(201).json({
      message: "Notice added successfully",
      notice,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to add notice" });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    await Notice.findByIdAndDelete(id);

    res.status(200).json({
      message: "Notice deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notice" });
  }
};
export const addBulkNotices = async (req, res) => {
  try {
    const { notices } = req.body;

    if (!Array.isArray(notices) || notices.length === 0) {
      return res.status(400).json({
        error: "notices must be a non-empty array",
      });
    }

    const formattedNotices = notices.map((n) => ({
      title: n.title,
      tag: n.tag,
      link: n.link,
    }));

    const savedNotices = await Notice.insertMany(formattedNotices);

    res.status(201).json({
      message: "Notices added successfully",
      count: savedNotices.length,
      notices: savedNotices,
    });
  } catch (err) {
    console.error("Error adding bulk notices:", err);
    res.status(500).json({ error: "Failed to add notices" });
  }
};

// PUBLIC – Get active notices (for website users)
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select("title tag link createdAt");

    res.status(200).json(notices);
  } catch (err) {
    console.error("Error fetching public notices:", err);
    res.status(500).json({ error: "Failed to fetch notices" });
  }
};
// UPDATE NOTICE (ADMIN)
export const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, tag, link, isActive } = req.body;

    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    if (title !== undefined) notice.title = title;
    if (tag !== undefined) notice.tag = tag;
    if (link !== undefined) notice.link = link;
    if (isActive !== undefined) notice.isActive = isActive;

    await notice.save();

    res.status(200).json({
      message: "Notice updated successfully",
      notice,
    });
  } catch (err) {
    console.error("Error updating notice:", err);
    res.status(500).json({ error: "Failed to update notice" });
  }
};
