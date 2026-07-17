import { Router } from "express";
import { requireAuth } from "../middlware/requireAuth";

const router = Router();

// router.get("/me", requireAuth, profile)