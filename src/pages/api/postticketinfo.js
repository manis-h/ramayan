import dbConnect from "@/lib/database";
import Ticket from "@/models/TicketInfo";

export default async (req, res) => {

  try {

    dbConnect()
    // fetch the user form the frontend
    const { user } = req.body;
    console.log(req.body)
    if (!user ) {
      return res.status(400).json({
        message: "Missing user ",
      });
    }

    // now save the user in the database Ticket
    const createdUser = new Ticket({
      user,
    });

    await createdUser.save(); // Use save() instead of bulkSave()

    return res.status(201).json({
      success: true,
      message: "User Created successfully",
      data: createdUser,
    });
  } catch (error) {
    console.error(`Error creating user: ${error.message}`); // Log the error message
    return res.status(500).json({
      success: false,
      message: "There is an issue while creating the user",
    });
  }
};