import { Router } from "express";
import { educationController } from "../controllers/educationController.js";

const router = Router();

router.get("/", educationController.getAllEducations);
router.get("/:id", educationController.getEducationById);
router.post("/", educationController.createNewEducation);
router.put("/:id", educationController.updateEducationById);
router.delete("/:id", educationController.deleteEducationById);

export default router;