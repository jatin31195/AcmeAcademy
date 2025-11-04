import express from "express";
import {
  createPracticeSet,
  getAllPracticeSets,
  getPracticeSetById,
} from "../controllers/practiceSetController.js";

const router = express.Router();
router.post("/", createPracticeSet);
router.get("/", getAllPracticeSets);
router.get("/:id", getPracticeSetById);

export default router;
