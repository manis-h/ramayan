import dbConnect from "@/lib/database";
import Ticket from "@/models/TicketInfo";

export default async (req, res) => {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch the user ID from the request body
    const { id } = req.body;

    // Find the user by their ticket ID
    const user = await Ticket.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    console.log(user)
    // Add or update the status field in the ticketInfo object
    user.ticketInfo.status = true;
console.log(user)
    // Save the updated document
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Status changed successfully"
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "There is an issue changing the status of the user"
    });
  }
};
