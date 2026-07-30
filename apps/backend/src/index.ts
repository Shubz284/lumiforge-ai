import express from "express";
// import authRouter from "../src/routes/auth.routes";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import imageRouter from "../src/routes/images.routes"
import { auth } from "./lib/auth";
import modelsRouter from "../src/routes/models.route"
import paymentRouter from "../src/routes/payment.routes"
import creditRouter from "../src/routes/credits.route"
import { creditsWebhookHandler } from "./controller/payment.controller";
import { welcomeEmail } from "./emails/welcomeEmail";
import { sendEmail } from "./service/resend.service";
import userRouter from "../src/routes/user.routes"

const app = express();

app.use(
  cors({
    // env.FRONTEND_URL is a list of allowed origins (multiple domains).
    origin: [
      process.env.FRONTEND_URL!
    ],
    credentials: true,
  }),
);

// Better-auth handler must be mounted BEFORE express.json().
app.all("/api/auth/*splat", toNodeHandler(auth));
// app.use("/api/auth/v1", authRouter);

app.post(
  "/api/webhook/razorpay",
  express.raw({ type: "application/json" }),
  creditsWebhookHandler
);

app.use(express.json());
app.use("/api/v1", imageRouter);
app.use("/api/v1", paymentRouter);
app.use("/api/v1", modelsRouter);
app.use("/api/v1", creditRouter);
app.use("/api/v1", userRouter)

// app.get("/test-welcome-email", async (req, res) => {
//   const email = welcomeEmail();

//   await sendEmail({
//     to: "@gmail.com",
//     subject: email.subject,
//     html: email.html,
//   });

//   res.send("Welcome email sent!");
// });

export default app;
