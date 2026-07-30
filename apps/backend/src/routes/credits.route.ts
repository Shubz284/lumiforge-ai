import { Router } from "express";
import { requireAuth } from "../middlware/requireAuth";
import { currentCredits, pricingDetails } from "../controller/credits.controller";

const router = Router();

router.get("/credits", requireAuth, currentCredits);
router.get("/checkout/pricing", pricingDetails)

export default router;