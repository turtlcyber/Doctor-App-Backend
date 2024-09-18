const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            unique: true,
            default: ""
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        profilePic: {
            type: String,
        },

        gender: {
            type: String,
            enum: ["MALE", "FEMALE", "OTHER", "UNDEFINED"],
            default: "UNDEFINED",
        },

        Address: {
            address: {
                type: String,
                default: ""
            },

            apartment: {
                type: String,
                default: ""
            },

            city: {
                type: String,
                default: ""
            },

            post_code: {
                type: String,
                default: ""
            },

            state: {
                type: String,
                default: ""
            }
        },

        email: {
            type: String,
            default: ""
        },

        phone: {
            type: String,
            default: ""
        },

        date_of_birth: {
            type: String,
            default: ""
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
