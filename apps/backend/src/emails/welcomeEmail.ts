export function welcomeEmail() {
  return {
    subject: "🎉 Welcome to LumiForge AI!",

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
        
        <h2 style="color: #4F46E5;">
          Welcome to LumiForge AI 🚀
        </h2>

        <p>
          Hi there,
        </p>

        <p>
          Your email has been successfully verified, and your account is now ready to use.
        </p>

        <p>
          With <strong>LumiForge AI</strong>, you can transform your ideas into stunning AI-generated images using powerful image generation models.
        </p>

        <div style="background:#f9fafb; border-radius:8px; padding:16px; margin:24px 0;">
          <h3 style="margin-top:0;">What's next?</h3>
          <ul style="padding-left:20px;">
            <li>✨ Generate high-quality AI images</li>
            <li>🎨 Experiment with different AI models</li>
            <li>🖼️ View and download your generated images</li>
            <li>💳 Purchase additional credits whenever you need them</li>
          </ul>
        </div>

        <p>
          We're excited to have you on board and can't wait to see what you create.
        </p>

        <p>
          Happy creating!<br>
          <strong>— The LumiForge AI Team</strong>
        </p>

        <hr style="border:none; border-top:1px solid #e5e7eb; margin:32px 0;" />

        <p style="font-size:12px; color:#6b7280;">
          If you did not create this account, please contact us immediately.
        </p>

      </div>
    `,
  };
}
