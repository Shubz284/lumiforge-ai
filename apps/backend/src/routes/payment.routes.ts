import { Router } from "express";
import { requireAuth } from "../middlware/requireAuth";
import { createRazorpayOrder, transactionHistory, verifyPayment } from "../controller/payment.controller";

const router = Router();

router.post("/payments/create-order", requireAuth, createRazorpayOrder);
router.post("/payments/verify", requireAuth, verifyPayment);
router.get("/payments/transactions", requireAuth, transactionHistory)

export default router