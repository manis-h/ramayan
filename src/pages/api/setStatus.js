import dbConnect from "@/lib/database";
import Ticket from "@/models/TicketInfo";

export default async (req, res) => {

  try {

    dbConnect()
    // fetch the user form the frontend
    const id = req.body

    const user = await Ticket.findById(id)
    user.ticketInfo.status= !user.ticketInfo.status
await user.save()
    return res.status(201).json({
      success: true,
      message: "Status Changed Successfully",
      data: createdUser,
    });
  } catch (error) {
    console.error(`Error : ${error.message}`); // Log the error message
    return res.status(500).json({
      success: false,
      message: "There is an issue changing status of the user",
    });
  }
};