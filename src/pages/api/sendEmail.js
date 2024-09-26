// pages/api/sendEmail.js
import nodemailer from 'nodemailer';
import { validateEmail, checkDomain } from '@/utils/validateEmail'; // Ensure both functions are imported correctly


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email , name } = req.body;

    // Validate the email and check its domain
    // const isValidEmail = validateEmail(email);
    // const isDomainValid = checkDomain(email);

    // if (!isValidEmail || !isDomainValid) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid email",
    //   });
    // }

    // Configure the transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Your email provider's SMTP server
      port: 465, // Usually 587 for TLS or 465 for SSL
      secure: true, // true for 465, false for other ports
      auth: {
        user: `manish@only1loan.com`, // Your email address
        pass: `wjftcztzdnrhupdb`, // Your email password or app-specific password
      },
      tls: {
        rejectUnauthorized: false, // This allows self-signed certificates
      },
    });

    const htmlToSend = `
      <p>We are grateful to acknowledge the generous contribution of ₹100 from ₹${name}  towards the Luv Kusha Ramayan initiative. Your support will help us in preserving and promoting the rich cultural heritage and teachings of the Ramayan.</p>
      <p>This donation will go a long way in furthering our cause, and we sincerely appreciate your commitment to our mission. May Lord Ram bless you with peace, prosperity, and happiness.</p>
      <h3>Donation Details:</h3>
      <p>Donor’s Name: [Insert Donor's Name]</p>
      <p>Amount Donated: ₹$100</p>
      <p>Mode of Payment: Online Transfer</p>
      <p>Donation Reference Number: {${ utrno}}</p>
      <p>Thank you once again for your kind support.</p>
      <p>Warm regards,<br>[Organization/Committee Name]<br>Luv Kusha Ramayan Committee</p>
    `;

    // Set up email data
    const mailOptions = {
      from: `Naman Finlease <manish@only1loan.com>`, // Sender address
      to: email, // Recipient
      subject: "Thanks for Payment", // Subject line
      text: "", // Plain text body
      priority: "high",
      html: htmlToSend,
    };

    try {
      // Send mail
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending email', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
