const nodeMailer = require("nodemailer")
const sendEmail = async (email,subject,message)=>{
const transporter = await nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,
    port: process.env.SMTP_PORT,
    auth :{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        
    }
})
const mailOptions = {
    from:process.env.SMTP_Mail,
    to: email,
    html: message
};

await transporter.sendEmail(mailOptions);
};
module.exports = {sendEmail}