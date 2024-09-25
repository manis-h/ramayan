import aws from 'aws-sdk';
import multer from 'multer';
import Ticket from '@/models/TicketInfo';

// Initialize AWS S3
const s3 = new aws.S3({
  accessKeyId: "AKIAQ3EGUBYBZD6YKHWZ",
  secretAccessKey: "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",
  region: 'ap-south-1',
});

// Configure multer for handling multipart form data
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('screenshot'); // Single file field 'screenshot'

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

      const file = req.file; // Access the uploaded file
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
        // Upload the file to S3
        const screenshotUrl = await uploadFileToS3(file);
        console.log('Screenshot URL:', screenshotUrl);

        // Access user data from form fields
        const { user } = req.body; // Access user data from form data

        // Parse user if it's a stringified JSON object
        let userData;
        try {
          userData = typeof user === 'string' ? JSON.parse(user) : user;
        } catch (parseError) {
          return res.status(400).json({ error: 'Invalid user data' });
        }

        console.log('User data:', userData); // Check the parsed user data

        if (!userData) {
          return res.status(400).json({ error: 'No user data provided' });
        }

        console.log("The user data is ")

        // Save the ticket in the database
        const createdTicket = new Ticket({
          user: {"userData"  : userData}, // userData is now an object
          ticketInfo: {  "screenshot_Url" : screenshotUrl },
        });

        console.log("The created Ticket is ",createdTicket);
  createdTicket.save()
        // const savedTicket = await createdTicket.save();
console.log("model")
        return res.status(200).json({
          success: true,
          screenshotUrl,
          ticketInfo: createdTicket,
        });
      } catch (error) {
        return res.status(500).json({ error: `Error processing request: ${error.message}` });
      }
    });
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
