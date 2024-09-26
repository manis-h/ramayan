const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    user: {
        type: Object,
        require: true
    },
    ticketInfo: {
        screenshot_Url: String,
        utrno: String,
        status: {
            require: true,
            type: Boolean
        }
    },
    // Add a disabled field
  disabled: { type: Boolean, default: false },
});


const Ticket = mongoose.models.Ticket || new mongoose.model("Ticket", TicketSchema);
export default Ticket;