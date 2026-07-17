export function existingUserEmail() {
  return {
    subject: "Sign-up attempt with your email",

    html: `
      <div style="font-family:sans-serif">
        <h2>Account Already Exists</h2>

        <p>
          Someone tried to create an account using your email.
        </p>

        <p>
          If this was you, simply sign in.
        </p>

        <p>
          Otherwise, ignore this email.
        </p>
      </div>
    `,
  };
}
