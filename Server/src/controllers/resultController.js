import Result from "../models/Result.js";
import slugify from "slugify";
import { uploadToCloudinary } from "../utils/multerCloudinary.js";
import Gallery from "../models/Gallery.js";
export const getResultsByYear = async (req, res) => {
  try {
    const { exam, year } = req.params;
    const results = await Result.find({
      exam,
      year: Number(year),
    }).sort({ rank: 1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch results" });
  }
};

export const getResultByRank = async (req, res) => {
  try {
    const { exam, year, rank } = req.params;
    const result = await Result.findOne({ exam, year, rank: Number(rank) });
    if (!result) return res.status(404).json({ message: "Result not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch result" });
  }
};


export const uploadResultPhoto = async (req, res) => {
  try {
    const { exam, year, rank, name, score,photoType } = req.body;
    const cloudUrl = await uploadToCloudinary(req.file?.path, "results");

    if (!cloudUrl)
      return res.status(400).json({ error: "Failed to upload to Cloudinary" });

    const slug = slugify(`${exam}-${year}-air-${rank}-${name}`, {
      lower: true,
      strict: true,
    });

    const result = await Result.findOneAndUpdate(
      { exam: exam.toLowerCase(), year, rank },
      { name, score, photoUrl: cloudUrl, slug, photoType:photoType.toLowerCase()},
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Result uploaded successfully", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload result photo" });
  }
};


export const addGalleryImage = async (req, res) => {
  try {
    const { eventName, year, rank } = req.body;

    const cloudUrl = await uploadToCloudinary(req.file?.path, "gallery");
    if (!cloudUrl)
      return res.status(400).json({ error: "Failed to upload image to Cloudinary" });

    const slug = slugify(
      `${eventName || "image"}-${year || ""}-${rank || ""}-${Date.now()}`,
      { lower: true, strict: true }
    );

    const image = new Gallery({
      url: cloudUrl,
      eventName,
      year,
      rank,
      slug,
    });

    await image.save();

    res.status(200).json({
      message: "Image added successfully",
      image,
    });
  } catch (err) {
    console.error("Error adding gallery image:", err);
    res.status(500).json({ error: "Failed to add gallery image" });
  }
};

export const getGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch gallery images" });
  }
};


export const getTopResults = async (req, res) => {
  try {
    const results = await Result.find({
      exam: { $ne: "gallery" },
      rank: { $exists: true },
    })
      .sort({ rank: 1 })
      .limit(20)
      .select("name exam year rank score photoUrl slug");

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top results" });
  }
};
export const getCombinedResultImages = async (req, res) => {
  try {
    const results = await Result.find({ photoType: "combined" })
      .sort({ year: -1, rank: 1 })
      .select("name exam year rank score photoUrl slug photoType");

    if (!results.length)
      return res.status(404).json({ message: "No combined result images found" });

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching combined result images:", err);
    res.status(500).json({ error: "Failed to fetch combined result images" });
  }
};
