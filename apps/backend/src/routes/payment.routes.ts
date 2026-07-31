import { Router } from "express";
import { requireAuth } from "../middlware/requireAuth";
import { createRazorpayOrder, creditsWebhookHandler, transactionHistory, verifyPayment } from "../controller/payment.controller";
import { verifyPaymentSignature } from "../lib/verifyPaymentSignature";

const router = Router();

router.post("/payments/create-order", requireAuth, createRazorpayOrder);
router.post("/payments/verify", requireAuth, verifyPayment);
router.get("/payments/transactions", requireAuth, transactionHistory)

export default router