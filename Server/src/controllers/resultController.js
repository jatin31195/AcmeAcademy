import Result from "../models/Result.js";
import slugify from "slugify";
import { uploadToCloudinary } from "../utils/multerCloudinary.js";

export const getResultsByYear = async (req, res) => {
  try {
    const { exam, year } = req.params;
    const results = await Result.find({ exam, year }).sort({ rank: 1 });
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
    const { exam, year, rank, name, score } = req.body;
    const cloudUrl = await uploadToCloudinary(req.file?.path, "results");

    if (!cloudUrl)
      return res.status(400).json({ error: "Failed to upload to Cloudinary" });

    const slug = slugify(`${exam}-${year}-air-${rank}-${name}`, {
      lower: true,
      strict: true,
    });

    const result = await Result.findOneAndUpdate(
      { exam, year, rank },
      { name, score, photoUrl: cloudUrl, slug },
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
    const { eventName, year } = req.body;
    const cloudUrl = await uploadToCloudinary(req.file?.path, "gallery");

    if (!cloudUrl)
      return res.status(400).json({ error: "Failed to upload image to Cloudinary" });

    let galleryHolder = await Result.findOne({ exam: "gallery" });
    if (!galleryHolder)
      galleryHolder = new Result({ exam: "gallery", year: 0, galleryImages: [] });

    const slug = slugify(`${eventName || "event"}-${year || ""}`, {
      lower: true,
      strict: true,
    });

    galleryHolder.galleryImages.push({ url: cloudUrl, eventName, year, slug });
    await galleryHolder.save();

    res.status(200).json({ message: "Gallery image added", galleryHolder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add gallery image" });
  }
};

export const getPastGallery = async (req, res) => {
  try {
    const gallery = await Result.findOne({ exam: "gallery" });
    res.status(200).json(gallery?.galleryImages || []);
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
