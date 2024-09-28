// import dbConnect from "@/lib/database";
// import Ticket from "@/models/TicketInfo";
// import nodemailer from "nodemailer"; // Import nodemailer

// // Send Email Function
// async function sendmail(mail, name, utr) {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com", // Your email provider's SMTP server
//     port: 465, // Usually 587 for TLS or 465 for SSL
//     secure: true, // true for 465, false for other ports
//     auth: {
//       user: `manish@only1loan.com`, // Your email address
//       pass: `wjftcztzdnrhupdb`, // Your email password or app-specific password
//     },
//     tls: {
//       rejectUnauthorized: false, // This allows self-signed certificates
//     },
//   });

//   // Email content
//   const htmlToSend = `
//       <p>We are grateful to acknowledge the generous contribution of ₹100 from ${name} towards the Luv Kusha Ramayan initiative. Your support will help us in preserving and promoting the rich cultural heritage and teachings of the Ramayan.</p>
//       <p>This donation will go a long way in furthering our cause, and we sincerely appreciate your commitment to our mission. May Lord Ram bless you with peace, prosperity, and happiness.</p>
//       <h3>Donation Details:</h3>
//       <p>Donor’s Name: ${name}</p>
//       <p>Amount Donated: ₹100</p>
//       <p>Mode of Payment: Online Transfer</p>
//       <p>Donation Reference Number: ${utr}</p>
//       <p>Thank you once again for your kind support.</p>
//       <p>Warm regards,<br>Luv Kusha Ramayan Committee</p>
//     `;

//   // Set up email data
//   const mailOptions = {
//     from: `Naman Finlease <manish@only1loan.com>`, // Sender address
//     to: mail, // Recipient email
//     subject: "Thanks for Payment", // Subject line
//     html: htmlToSend, // HTML body
//     priority: "high",
//   };

//   try {
//     // Send email
//     await transporter.sendMail(mailOptions);
//     return { success: true };
//   } catch (error) {
//     throw new Error(`Error sending email: ${error.message}`);
//   }
// }

// // Main function to handle requests
// export default async (req, res) => {
//   if (req.method === "POST") {
//     try {
//       // Connect to the database
//       await dbConnect();

//       // Fetch the user ID from the request body
//       const { id , amountreceived , approved } = req.body;

//       if( !id && !amountreceived && !approved){
//         return res.status(400).json({
//           message : "Do give the valid id , amountreceived , approved"
//         })
//       }

//       // Find the user by their ticket ID
//       const user = await Ticket.findById(id);

//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       // // Ensure ticketInfo and status exist
//       if (!user.ticketInfo) {
//         user.ticketInfo = {}; // Initialize if not present
//       }

//      // Add or update the status field in the ticketInfo object
//      user.ticketInfo.status = true;
//      console.log(user)
//          // Save the updated document
//          await user.save();

//       // Send email
//       console.log("The mail is ",user.user.email,user.user.fName)
//       await sendmail(user.user.email, user.user.fName, user.ticketInfo.utrno);

//       return res.status(201).json({
//         success: true,
//         message: "Status changed successfully and mail sent to the user",
//       });
//     } catch (error) {
//       console.error(`Error: ${error.message}`);
//       return res.status(500).json({
//         success: false,
//         message: "There is an issue changing the status of the user",
//       });
//     }
//   } else {
//     // Handle non-POST requests
//     res.setHeader("Allow", ["POST"]);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// };

import dbConnect from "@/lib/database";
import Ticket from "@/models/TicketInfo";
import nodemailer from "nodemailer"; // Import nodemailer

// Send Email Function
async function sendmail(mail, name, utr, amount) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Your email provider's SMTP server
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

  // Email content
  const htmlToSend = `
      <p>We are grateful to acknowledge the generous contribution of ₹${amount} from ${name} towards the Luv Kusha Ramayan initiative. Your support will help us in preserving and promoting the rich cultural heritage and teachings of the Ramayan.</p>
      <p>This donation will go a long way in furthering our cause, and we sincerely appreciate your commitment to our mission. May Lord Ram bless you with peace, prosperity, and happiness.</p>
      <h3>Donation Details:</h3>
      <p>Donor’s Name: ${name}</p>
      <p>Amount Donated: ₹${amount}</p>
      <p>Mode of Payment: Online Transfer</p>
      <p>Donation Reference Number: ${utr}</p>
      <p>Thank you once again for your kind support.</p>
      <p>Warm regards,<br>Luv Kusha Ramayan Committee</p>
    `;

  // Set up email data
  const mailOptions = {
    from: `Naman Finlease <manish@only1loan.com>`, // Sender address
    to: mail, // Recipient email
    subject: "Thanks for Payment", // Subject line
    html: htmlToSend, // HTML body
    priority: "high",
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
}

// Main function to handle requests
export default async (req, res) => {
  if (req.method === "POST") {
    try {
      // Connect to the database
      await dbConnect();

      // Fetch the user ID, amount received, and approval status from the request body
      const { id, amountreceived, approved } = req.body;

      // Validate input
      if (!id || !amountreceived || approved === undefined) {
        return res.status(400).json({
          message:
            "Please provide valid id, amountreceived, and approved status.",
        });
      }

      // Ensure amountreceived is a valid number
      const amount = parseFloat(amountreceived);
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          message: "Invalid amount. Please provide a positive number.",
        });
      }

      // Find the user by their ticket ID
      const user = await Ticket.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Ensure ticketInfo exists
      if (!user.ticketInfo) {
        user.ticketInfo = {}; // Initialize if not present
      }

      // The user is
      console.log("The previous user ", user);

      // Add or update the status and amount fields in the ticketInfo object
      user.ticketInfo.status = true; // Mark the status as approved
      user.ticketInfo.amount = amount; // Store the amount received
      console.log(user);

      // Save the updated document
      // console.log("This is the userdata ", userdata);
      // Send email
      console.log("The mail is ", user.user.email, user.user.fName);
      const mail = await sendmail(
        user.user.email,
        user.user.fName,
        user.ticketInfo.utrno,
        amount
      );
      if (mail) {
        var userdata = await user.save();
        
        
              return res.status(201).json({
                success: true,
                message: "Status changed successfully and mail sent to the user",
              });
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: "There is an issue changing the status of the user",
      });
    }
  } else {
    // Handle non-POST requests
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
