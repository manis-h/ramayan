

// import aws from 'aws-sdk';
// import multer from 'multer';

// // // Initialize AWS S3
// const s3 = new aws.S3({
//   accessKeyId:"AKIAQ3EGUBYBZD6YKHWZ",
//   secretAccessKey: "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",
//   region: 'ap-south-1',
// });

// // Configure multer for handling multipart form data
// const storage = multer.memoryStorage(); // Use memory storage for files
// const upload = multer({ storage }).single('screenshot'); // 'screenshot' is the name of the form field

// // Helper function to upload a file to S3
// const uploadFileToS3 = async (file) => {
//   const params = {
//     Bucket: 'ramleela', // Your bucket name
//     Key: `${Date.now()}_${file.originalname}`, // Unique file name
//     Body: file.buffer, // File buffer from multer
//     ContentType: file.mimetype,
//   };

//   return new Promise((resolve, reject) => {
//     s3.upload(params, (err, data) => {
//       if (err) {
//         reject(err);
//       }
//       resolve(data.Location); // URL of the uploaded file
//     });
//   });
// };

// // Disable Next.js body parsing (required for file uploads)
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     upload(req, res, async (err) => {
//       if (err) {
//         return res.status(500).json({ error: 'Error parsing form data' });
//       }

//       // Access the file and form fields
//       const file = req.file; // Uploaded file (screenshot)
//       const formFields = req.body; // Other form fields

//       if (!file) {
//         return res.status(400).json({ error: 'No file uploaded' });
//       }

//       try {
//         const screenshotUrl = await uploadFileToS3(file); // Upload file to S3
//         return res.status(200).json({ success: true, url: screenshotUrl, fields: formFields });
//       } catch (error) {
//         return res.status(500).json({ error: 'Error uploading file to S3' });
//       }
//     });
//   } else {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }
// }


import aws from 'aws-sdk';
import multer from 'multer';
import nextConnect from 'next-connect';

// Initialize AWS S3
// Initialize AWS S3
const s3 = new aws.S3({
  accessKeyId:"AKIAQ3EGUBYBZD6YKHWZ",
  secretAccessKey: "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",
  region: 'ap-south-1',
});

// Configure multer for handling multipart form data
const storage = multer.memoryStorage(); // Use memory storage for files
const upload = multer({ storage }).single('screenshot'); // 'screenshot' is the name of the form field

// Helper function to upload a file to S3
const uploadFileToS3 = async (file) => {
  const params = {
    Bucket: 'ramleela', // Your bucket name
    Key: `ramleelascreenshots/${Date.now()}`, // Unique file name
    Body: file.buffer, // File buffer from multer
    ContentType: file.mimetype,
    // ACL: 'public-read',
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
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

    console.log(

    )
    // Handle file upload with multer
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing form data' });
      }

      const file = req.file; // Access the uploaded file
      const formFields = req.body; // Access additional form fields

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
        const screenshotUrl = await uploadFileToS3(file); // Upload the file to S3
        return res.status(200).json({ success: true, url: screenshotUrl, fields: formFields });
      } catch (error) {
        return res.status(500).json({ error: `Error uploading file to S3: ${error.message}` });
      }
    });
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
