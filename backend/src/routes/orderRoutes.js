import express from "express";

import protect from "../middleware/authMiddleware.js";
import adminProtect from "../middleware/adminMiddleware.js";

import orderController from "../controllers/orderController.js";

const router = express.Router();

// ADMIN
router.get(
    "/admin/all",adminProtect,orderController.getAllOrders);
    
router.put(
  "/admin/:id/status",
  adminProtect,
  orderController.updateOrderStatus
);
// CUSTOMER
router.post("/", protect, orderController.createOrder);
router.get("/", protect, orderController.getOrders);
router.get("/:id", protect, orderController.getOrderById);

export default router;