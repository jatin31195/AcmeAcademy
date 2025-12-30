import nodemailer from "nodemailer";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();
export const sendCounsellingMail = async (req, res) => {
  try {
    const { name, email, phone, center, subject } = req.body;

    if (!name || !phone || !center || !subject) {
      return res.status(400).json({ error: "Please fill all required fields." });
    }

  
    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });


    
    const mailHTML = `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #f8f9fc;
        padding: 30px;
        border-radius: 10px;
        border: 1px solid #e0e0e0;
        max-width: 600px;
        margin: 20px auto;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
      ">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/dwqvrtvu1/image/upload/v1762162237/logo_1_yo58k3.png" 
               alt="ACME Academy Logo" 
               style="width: 120px; height: auto; border-radius: 8px;" />
        </div>

        <h2 style="
          color: #2b2d42;
          text-align: center;
          font-size: 22px;
          margin-bottom: 20px;
        ">
          📝 New Counselling Form Submission
        </h2>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Name:</td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Email:</td>
            <td style="padding: 8px 0;">${email || "Not Provided"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Phone:</td>
            <td style="padding: 8px 0;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Preferred Center:</td>
            <td style="padding: 8px 0;">${center}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Query Type:</td>
            <td style="padding: 8px 0;">${subject}</td>
          </tr>
        </table>

        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #ddd;" />

        <p style="
          text-align: center;
          font-size: 14px;
          color: #555;
        ">
          💡 Sent from <strong>ACME Academy Counselling Form</strong><br/>
          <span style="font-size: 13px;">This is an automated message. Please do not reply.</span>
        </p>
      </div>
    `;

    const mailOptions = {
      from: `"ACME Academy" <acmeacademy15@gmail.com>`,
      to: "acmenimcet@gmail.com",
      subject: `📩 New Counselling Enquiry: ${subject}`,
      html: mailHTML,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Mail sent successfully!" });
  } catch (err) {
    console.error("Mail Error:", err);
    res.status(500).json({ error: "Failed to send mail" });
  }
};

export const sendAdminMail = async (req, res) => {
  try {
    const { subject, message, emails, sendToAll } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: "Subject and message are required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let recipients = [];

    // ✅ Option 1: Send to ALL users
    if (sendToAll === true) {
      const users = await User.find({}, "email");
      recipients = users.map((u) => u.email).filter(Boolean);
    }

    // ✅ Option 2: Send to selected emails
    if (Array.isArray(emails) && emails.length > 0) {
      recipients = emails;
    }

    if (recipients.length === 0) {
      return res.status(400).json({ error: "No recipients found" });
    }

    const mailHTML = `
      <div style="font-family: Arial; padding:20px;">
        <h2 style="color:#2b2d42;">📢 ACME Academy Notification</h2>
        <p style="font-size:15px; line-height:1.6;">${message}</p>
        <hr/>
        <p style="font-size:12px;color:#666;">
          This is an official communication from ACME Academy.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"ACME Academy" <${process.env.EMAIL_USER}>`,
      bcc: recipients, // ✅ BCC to avoid exposing emails
      subject,
      html: mailHTML,
    });

    res.status(200).json({
      success: true,
      message: `Mail sent to ${recipients.length} recipient(s)`,
    });
  } catch (err) {
    console.error("Admin Mail Error:", err);
    res.status(500).json({ error: "Failed to send admin mail" });
  }
};