import { prisma } from "../../db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendEmail } from "../service/resend.service";
import { existingUserEmail } from "../emails/existingUserEmail";
import { verificationEmail } from "../emails/verificationEmail";
import { resetPasswordEmail } from "../emails/resetPasswordEmail";
import { env } from "../schema/schema";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    onExistingUserSignUp: async ({ user }) => {
      const email = existingUserEmail();
      void (await sendEmail({
        to: user.email,
        subject: email.subject,
        html: email.html,
      }).catch(console.error));
    },
    sendResetPassword: async ({ user, url }, request) => {
      const email = resetPasswordEmail(url);
      await sendEmail({
        to: user.email,
        subject: email.subject,
        html: email.html,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const email = verificationEmail(url);
      await sendEmail({
        to: user.email,
        subject: email.subject,
        html: email.html,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await prisma.user.update({
            where: { id: user.id },
            data: { credits: { increment: env.FREE_TRIAL_CREDITS } },
          });

          await prisma.creditTransaction.create({
            data: {
              userId: user.id,
              type: "BONUS",
              amount: env.FREE_TRIAL_CREDITS,
              balanceAfter: env.FREE_TRIAL_CREDITS,
              description: "Free trial credits",
            },
          });
        },
      },
    },
  },
});
