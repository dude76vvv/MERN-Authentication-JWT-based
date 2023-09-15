const nodemailer = require("nodemailer");

module.exports = async (email, subject, url, type) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: "dude76@dummy.com",
      to: email,
      subject: subject,
      html:
        type === "email"
          ? composeEmailVerification(url)
          : composeEmailVerificationOtp(url),
    });

    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return error;
  }
};

const composeEmailVerification = (url) => {
  return `<p>Please verify your email address by clicking on the link below. This link will expires in 1hr.</p>

	<p><b><a href="${url}">Confirm Email</a></b></p>
	
	`;
};

const composeEmailVerificationOtp = (url) => {
  return `<p>Please enter the OTP in App to continue the reset of password.The OTP will expires in 5 min</p>

	<p><b>${url}</b></p>
	
	`;
};
