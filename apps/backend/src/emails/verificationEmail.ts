export function verificationEmail(url: string) {
  return {
    subject: "Verify your email - LumiForge AI",

    html: `
      <div style="font-family:sans-serif">
        <h2>Verify your email</h2>

        <p>
          Click the button below to verify your email address.
        </p>

        <a href="${url}">
          Verify Email
        </a>

        <p>
          If you didn't create this account, ignore this email.
        </p>
      </div>
    `,
  };
}
