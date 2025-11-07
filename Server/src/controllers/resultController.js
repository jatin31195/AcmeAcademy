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
    const { exam, year, rank, name, score, photoType } = req.body;
    const cloudUrl = await uploadToCloudinary(req.file?.path, "results");

    if (!cloudUrl) {
      return res.status(400).json({ error: "Failed to upload to Cloudinary" });
    }

    // Build a readable identifier for slug
    const identifier = rank
      ? `air-${rank}`
      : score
      ? `score-${score}`
      : "unranked";

    // Initial slug
    let baseSlug = slugify(`${exam}-${year}-${identifier}-${name || "undefined"}`, {
      lower: true,
      strict: true,
    });

    // ✅ Always add new entry — ensure slug uniqueness
    let uniqueSlug = baseSlug;
    const existingSlug = await Result.findOne({ slug: uniqueSlug });
    if (existingSlug) {
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      uniqueSlug = `${baseSlug}-${randomSuffix}`;
    }

    // ✅ Create new result (no overwrite ever)
    const newResult = new Result({
      name,
      exam: exam?.toLowerCase(),
      year: year || null,
      rank: rank || null,
      score: score || null,
      photoUrl: cloudUrl,
      photoType: photoType?.toLowerCase(),
      slug: uniqueSlug,
    });

    await newResult.save();

    res.status(200).json({
      message: "Result uploaded successfully",
      result: newResult,
    });
  } catch (err) {
    console.error("Error uploading result photo:", err);
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


export const getAvailableYearsByExam = async (req, res) => {
  try {
    const { exam } = req.params;

   
    const years = await Result.distinct("year", { exam });

    
    const filteredYears = years
      .filter((y) => y !== null && y !== undefined)
      .sort((a, b) => b - a);


    const finalYears = [ ...filteredYears];

    res.status(200).json(finalYears);
  } catch (err) {
    console.error("Error fetching available years:", err);
    res.status(500).json({ error: "Failed to fetch results" });
  }
};

export const getAvailableExams = async (req, res) => {
  try {
    
    const exams = await Result.distinct("exam");

    
    const filteredExams = exams
      .filter((e) => e && e.trim() !== "")
      .map((e) => e.toUpperCase())
      .sort();

    res.status(200).json(filteredExams);
  } catch (err) {
    console.error("Error fetching available exams:", err);
    res.status(500).json({ error: "Failed to fetch available exams" });
  }
};
export const getHomeResultImages = async (req, res) => {
  try {
    const results = await Result.find({ photoType: { $regex: /^home$/i } })
      .sort({ _id: 1 }) 
      .select("name exam year rank score photoUrl slug photoType");

    if (!results.length)
      return res.status(404).json({ message: "No home result images found" });

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching home result images:", err);
    res.status(500).json({ error: err.message });
  }
};

