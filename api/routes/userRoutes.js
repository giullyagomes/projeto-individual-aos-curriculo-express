import { Router } from "express";
import { userController } from "../controllers/userController.js";

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createNewUser);
router.put("/:id", userController.updateUserById);
router.delete("/:id", userController.deleteUserById);

export default router;