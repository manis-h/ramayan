// api/uploadScreenshot.js
import aws from 'aws-sdk';
import multer from 'multer';
import Ticket from '@/models/TicketInfo';
import dbConnect from "@/lib/database";

// Initialize AWS S3
const s3 = new aws.S3({
  accessKeyId: "AKIAQ3EGUBYBZD6YKHWZ", // Replace with your actual access key
  secretAccessKey: "waEiCGsYqdLHoCDZg82z3IbZPMKg6GayuOMo3VXr", // Replace with your actual secret key
  region: 'ap-south-1', // Your AWS region
});

// Configure multer for handling multipart form data
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('screenshot');

// Helper function to upload a file to S3
const uploadFileToS3 = async (file) => {
  const params = {
    Bucket: 'ramleela', // Your bucket name
    Key: `ramleelascreenshots/${Date.now()}`, // Unique file name
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data.Location); // URL of the uploaded file
    });
  });
};

// Disable Next.js body parsing (required for file uploads)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Use multer to parse the file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing form data' });
      }

      const { userId , utr } = req.query; // Extract user ID from the query params
      console.log( "The user id is ",userId , "The utr is ",utr)
      if (!userId && !utr) {
        return res.status(400).json({ error: 'Missing user ID or utr  in query params' });
      }

      const file = req.file; // Access the uploaded file
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
        // Connect to DB
        await dbConnect();

        // Check if the user exists
        const user = await Ticket.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Ensure ticketInfo exists
        if (!user.ticketInfo) {
          user.ticketInfo = {}; // Initialize ticketInfo if it's undefined
        }

        // Upload the file to S3
        const screenshotUrl = await uploadFileToS3(file);

        // Update the user's record with the screenshot URL
        user.ticketInfo.screenshot_Url = screenshotUrl;
        user.ticketInfo.utrno = utr;

        // Save the updated user document
        await user.save();

        return res.status(200).json({
          success: true,
          message: "Screenshot uploaded and associated with user",
          screenshotUrl,
          user,
        });
      } catch (error) {
        return res.status(500).json({ error: `Error processing request: ${error.message}` });
      }
    });
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

