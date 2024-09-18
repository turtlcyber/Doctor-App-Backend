const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },

    email: {
        type: String,
        default: ""
    },

    phone: {
        type: String,
        default: ""
    },

    profilePic: {
        fileName: { type: String, default: "" },
        filePath: { type: String, default: "" }
    },

    experience: {
        type: String,
        default: ""
    },

    description: {
        type: String,
        default: ""
    },
}, {timestamps: true});


module.exports = mongoose.model("Doctor", doctorSchema);