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
// UPDATE RESULT (ADMIN)
export const updateResultById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, exam, year, rank, score } = req.body;

    const result = await Result.findById(id);
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    // Optional: upload new photo
    if (req.file?.path) {
      const cloudUrl = await uploadToCloudinary(req.file.path, "results");
      if (!cloudUrl) {
        return res.status(400).json({ error: "Image upload failed" });
      }
      result.photoUrl = cloudUrl;
    }

    // Update fields (only if provided)
    if (name !== undefined) result.name = name;
    if (exam !== undefined) result.exam = exam.toLowerCase();
    if (year !== undefined) result.year = year;
    if (rank !== undefined) result.rank = rank;
    if (score !== undefined) result.score = score;

    await result.save();

    res.status(200).json({
      message: "Result updated successfully",
      result,
    });
  } catch (err) {
    console.error("Error updating result:", err);
    res.status(500).json({ error: "Failed to update result" });
  }
};

export const deleteResultImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Result.findById(id);
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

   

    await Result.deleteOne({ _id: id });

    res.status(200).json({
      message: "Result image deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting result image:", err);
    res.status(500).json({ error: "Failed to delete result image" });
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
export const addCombinedResultImage = async (req, res) => {
  try {
    const { exam } = req.body;

    if (!exam) {
      return res.status(400).json({ error: "Exam is required" });
    }

    const cloudUrl = await uploadToCloudinary(req.file?.path, "results");
    if (!cloudUrl) {
      return res.status(400).json({ error: "Failed to upload image" });
    }

    const slug = slugify(
      `${exam}-combined-${Date.now()}`,
      { lower: true, strict: true }
    );

    const combinedResult = new Result({
      exam: exam.toLowerCase(),
      photoUrl: cloudUrl,
      photoType: "combined",
      slug,
    });

    await combinedResult.save();

    res.status(201).json({
      message: "Combined image added successfully",
      result: combinedResult,
    });
  } catch (err) {
    console.error("Error adding combined image:", err);
    res.status(500).json({ error: "Failed to add combined image" });
  }
};

export const deleteCombinedResultImage = async (req, res) => {
  try {
    const { id } = req.params;

    const combinedImage = await Result.findOne({
      _id: id,
      photoType: { $regex: /^combined$/i },
    });

    if (!combinedImage) {
      return res.status(404).json({
        message: "Combined image not found",
      });
    }

    // OPTIONAL: delete from Cloudinary if you store public_id
    // await deleteFromCloudinary(combinedImage.photoUrl);

    await Result.deleteOne({ _id: id });

    res.status(200).json({
      message: "Combined image deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting combined image:", err);
    res.status(500).json({ error: "Failed to delete combined image" });
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

export const addHomeResultImage = async (req, res) => {
  try {
    const { exam } = req.body;

    if (!exam) {
      return res.status(400).json({ error: "Exam is required" });
    }

    const cloudUrl = await uploadToCloudinary(req.file?.path, "results");
    if (!cloudUrl) {
      return res.status(400).json({ error: "Failed to upload image" });
    }

    const slug = slugify(
      `${exam}-home-${Date.now()}`,
      { lower: true, strict: true }
    );

    const homeResult = new Result({
      exam: exam.toLowerCase(),
      photoUrl: cloudUrl,
      photoType: "home",
      slug,
    });

    await homeResult.save();

    res.status(201).json({
      message: "Home image added successfully",
      result: homeResult,
    });
  } catch (err) {
    console.error("Error adding home image:", err);
    res.status(500).json({ error: "Failed to add home image" });
  }
};


export const deleteHomeResultImage = async (req, res) => {
  try {
    const { id } = req.params;

    const homeImage = await Result.findOne({
      _id: id,
      photoType: { $regex: /^home$/i },
    });

    if (!homeImage) {
      return res.status(404).json({
        message: "Home image not found",
      });
    }

    // OPTIONAL: delete from Cloudinary if you store public_id
    // await deleteFromCloudinary(homeImage.photoUrl);

    await Result.deleteOne({ _id: id });

    res.status(200).json({
      message: "Home image deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting home image:", err);
    res.status(500).json({ error: "Failed to delete home image" });
  }
};
