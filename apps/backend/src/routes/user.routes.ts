
import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middlware/requireAuth";
import { prisma } from "../../db";


const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const userId = (req as AuthedRequest).userId;
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { isTrialUser: true, credits: true },
  });
  res.json({ success: true, data: user });
});

export default router;