export function resetPasswordEmail(url: string) {
  return {
    subject: "Reset your password",

    html: `
      <div style="font-family:sans-serif">
        <h2>Password Reset</h2>

        <p>
          Click below to reset your password.
        </p>

        <a href="${url}">
          Reset Password
        </a>

        <p>
          This link expires in 1 hour.
        </p>
      </div>
    `,
  };
}
