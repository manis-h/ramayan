// pages/api/disableUser.js
// import dbConnect from '../../lib/dbConnect'; // Database connection helper
// import User from '../../models/User'; // Import the Mongoose model for User
import dbConnect from "@/lib/database";
import Ticket from "@/models/TicketInfo";

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect(); // Ensure the database is connected
  switch (method) {
    case 'POST':
      try {
        // Get the user ID from the request body
        const { id } = req.body;

        // Find the user by ObjectId and update its 'disabled' status
        const user = await Ticket.findByIdAndUpdate(
          id, 
          { disabled: true }, // Set 'disabled' to true
          { new: true } // Return the updated document
        );

        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
