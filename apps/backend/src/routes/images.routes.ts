import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middlware/requireAuth";
import { createImage, deleteImage, downLoadImage, getMyImage, getMyImages } from "../controller/image.controller";


const router = Router();

router.post("/generate-image", requireAuth, createImage);
router.get("/images", requireAuth,getMyImages);
router.get("/images/:imageId", requireAuth, getMyImage)
router.delete("/images/:imageId", requireAuth, deleteImage);
router.get("/images/:imageId/download", requireAuth, downLoadImage)

export default router;