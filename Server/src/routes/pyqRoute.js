import express from "express";
import * as pyqController from "../controllers/pyqController.js";

const router = express.Router();

router.get("/", pyqController.getPYQs);     
router.get("/:id", pyqController.getPYQ);  
router.post("/", pyqController.addPYQController);
router.post("/bulk", pyqController.addBulkPYQController);
export default router;
