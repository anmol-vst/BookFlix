const { generateVerifictionEmailTemplate } = require("./emailVerification");
const { sendEmail } = require("./sendEmail");
export async function sendVerificationCode(verificationCode, email, res) {
  try {
    const message = generateVerifictionEmailTemplate(verificationCode);
    sendEmail({
      email,
      subject: "Verification code BOOKFLIX ",
      message,
    });
    res.status(200).json({
      success: true,
      message: "verification code sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "verification code failed to send",
    });
  }
}
