const mongoose = require('mongoose');


const deletedUserSchema = new mongoose.Schema({
    userId: {
        type: String,
    },

    deletedUserData: {
        type: String,
    },

    reason: {
        type: String,
    },

    feedback: {
        type: String,
    },

    deletedAt: {
        type: String,
    }
}, {timestamps: true});


module.exports = mongoose.model("DeletedUser", deletedUserSchema);