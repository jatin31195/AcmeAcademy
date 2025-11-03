import nodemailer from "nodemailer";

export const sendCounsellingMail = async (req, res) => {
  try {
    const { name, email, phone, center, subject } = req.body;

    if (!name || !phone || !center || !subject) {
      return res.status(400).json({ error: "Please fill all required fields." });
    }

  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "acmeacademy15@gmail.com", 
        pass: "umla jwhq tojz apvl", 
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
