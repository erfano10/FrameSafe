import { Router } from "express";

import {
  createPurchaseController,
  getMyPurchasesController,
} from "../controllers/purchaseController";

import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";


const router = Router();


// CLIENT: Create a purchase
router.post(
  "/",
  authMiddleware,
  requireRole("CLIENT"),
  createPurchaseController
);


// CLIENT: Get own purchases
router.get(
  "/",
  authMiddleware,
  requireRole("CLIENT"),
  getMyPurchasesController
);


export default router;
