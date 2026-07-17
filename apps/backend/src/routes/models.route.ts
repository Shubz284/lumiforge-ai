import { Router } from "express";
import { listImageModels } from "../lib/openrouter";
import { modelsHandler } from "../controller/models.controller";

const router = Router();

router.get("/image/models", modelsHandler(listImageModels));

export default router