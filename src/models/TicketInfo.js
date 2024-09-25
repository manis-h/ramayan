const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    user :{
        type : Object,
        require :  true
    },
    ticketInfo : {
        type : Object,
        require  : true
    }
});


const Ticket = mongoose.models.Ticket|| new mongoose.model("Ticket",TicketSchema);
export default Ticket;