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
            required: true,
            type: Boolean,
            default : false
        },
        amount: {
            type: Number, // Use Number for amount
            required: true, // Add required if you want to enforce that this field must be present
            default: 0
        }
        
    },
    // Add a disabled field
  disabled: { type: Boolean, default: false },
});


const Ticket = mongoose.models.Ticket || new mongoose.model("Ticket", TicketSchema);
export default Ticket;