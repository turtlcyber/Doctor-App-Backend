const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookingSchema = new mongoose.Schema({
    userId: {
        type: String,
    },

    bookingId: {
        type: String,
    },

    appointment_date: {
        type: String,
        default: ""
    },

    doctorInstructions: {
        type: String,
        default: ""
    },

    notes: {
        type: String,
        default: ""
    },

    files: [
        {
            fileName: {
                type: String,
                default: ""
            },
    
            filePath: {
                type: String,
                default: ""
            }
        }
    ],

    doctor_name: {
        type: String,
    },

    doctor_id: {
        type: String,
    },

    slot: {
        type: String,
    },

    notes_file: {
        fileName: {
            type: String,
        },
	    filePath: {
            type: String,
        }
    },

    next_appointment_date: {
        type: String,
        default: ""
    }

}, {timestamps: true});

module.exports = mongoose.model("Booking", bookingSchema);