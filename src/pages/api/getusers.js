import dbConnect from "@/lib/database";
import Ticket from "@/models/TicketInfo";

export default async function getAllUsers(req, res) {
  try {
    await dbConnect(); // Added "await"
    console.log("DB connected successfully");
    if (req.method === 'GET') { // Corrected 'Get' to 'GET'
      const ticketDetails = await Ticket.find({ disabled : false });
      if (!ticketDetails) {
        return res.status(401).json({
          success: false,
          message: "There are no ticket details yet",
        });
      }

      return res.status(200).json({
        success: true,
        userinfo: ticketDetails,
      });

    } else {
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }
    
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Error while getting the user info",
    });
  }
}
