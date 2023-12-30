const nodemailer = require("nodemailer")
const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
        }
    })

    const mailOptions ={
        from: process.env.USER_EMAIL,
        to: options.email,
        subject: "Reset Password",
        text: options.message
    }

    try {
        const success = await transporter.sendMail(mailOptions);
        console.log("Email sent" + success.response);
    } catch (error) {
        console.error(error);
        if (options.res) {
            options.res.status(500).json({ message: "something went wrong" });
        }
    }
}


module.exports={
    sendEmail
}