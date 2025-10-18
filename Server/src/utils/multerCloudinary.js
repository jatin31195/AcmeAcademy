import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js"; 

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "test_solutions",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
