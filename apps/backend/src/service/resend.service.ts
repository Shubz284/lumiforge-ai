import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface sendEmailInputs {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({
  to,
  subject,
  html,
}:sendEmailInputs) {
  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    html,
  });

  if (error) {
    console.error(error);
    throw error;
  }
}
