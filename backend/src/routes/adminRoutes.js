import express from "express";

import adminController from "../controllers/adminController.js";
import adminProtect from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/register", adminController.registerAdmin);

router.post("/login", adminController.loginAdmin);

// Protected admin route
router.get("/dashboard", adminProtect, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Admin Dashboard",
    admin: req.admin,
  });
});

export default router;