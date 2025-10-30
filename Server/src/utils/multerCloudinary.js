import multer from "multer";
import path from "path";
import fs from "fs";
import cloudinary from "./cloudinary.js";
const uploadPath = path.join(process.cwd(), "uploads", "temp");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ✅ Multer: save temporarily before Cloudinary upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  },
});

export const upload = multer({ storage });

// ✅ Helper: Upload to Cloudinary and delete local copy
export const uploadToCloudinary = async (localFilePath, folder = "results") => {
  if (!localFilePath) return null;
  try {
    const res = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: "image",
    });

    // Delete local file
    fs.unlinkSync(localFilePath);
    return res.secure_url;
  } catch (err) {
    console.error("❌ Cloudinary Upload Failed:", err);
    return null;
  }
};