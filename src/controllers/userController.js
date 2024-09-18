const userModel = require("../models/userModel");
const adminModel = require("../models/adminModel");
const deletedUserModel = require('../models/deleteUserModel');
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { getCurrentIPAddress, generateRandomAlphaNumericID } = require("../uitls/utils");
const { port } = require("../config/config");
const { isValidObjectId } = require("mongoose");
const bookingModel = require("../models/bookingModel");

const { adminSecretKey } = require('../config/config');


// LOGIN USER
const authenticateUser = async (req, res) => {
    try {
        let { email, profilePic, name, userId } = req.body;

        const isUserExists = await userModel.findOne({ userId: userId });

        if (!isUserExists) {
            let userObj = {
                userId,
                name,
                email,
                profilePic
            };

            let newUser = await userModel.create(userObj);
            return res.status(200).send({
                status: true,
                message: "Authentication successful",
                data: newUser
            });
        } else {
            return res.status(200).send({
                status: true,
                message: "Authentication successful",
                data: isUserExists,
            });
        };

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


// REGISTER USER
const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is required"});
        };

        let user = await userModel.findOne({ userId });

        if (!user) {
            return res.status(400).send({
                status: false,
                message: "User not found",
            });
        };

        let reqBody = req.body;

        if ("name" in reqBody) {
            user.name = reqBody.name;
        };

        if ("phone" in reqBody) {
            user.phone = reqBody.phone;
        };

        if ("gender" in reqBody) {
            user.gender = reqBody.gender;
        };

        if ("date_of_birth" in reqBody) {
            user.date_of_birth = reqBody.date_of_birth;
        };

        if ("Address" in reqBody) {
            if ("address" in reqBody.Address) {
                user.Address.address = reqBody.Address.address;
            };

            if ("apartment" in reqBody.Address) {
                user.Address.apartment = reqBody.Address.apartment;
            };

            if ("city" in reqBody.Address) {
                user.Address.city = reqBody.Address.city;
            };

            if ("post_code" in reqBody.Address) {
                user.Address.post_code = reqBody.Address.post_code;
            };

            if ("state" in reqBody.Address) {
                user.Address.state = reqBody.Address.state;
            }
        };

        if ("education" in reqBody) {
            user.education = reqBody.education;
        }

        await user.save();

        return res.status(200).send({
            status: true,
            message: "User updated successfully",
            data: user,
        });

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


// GET USER BY ID
const getUserById = async (req, res) => {
    try {
        let { userId, key } = req.params;

        if (!userId || !key) {
            return res.status(400).send({ status: false, message: "All fields are required"});
        };

        if (key !== adminSecretKey) {
            return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!"});
        };

        let user = await userModel.findOne({ userId });

        if (!user) {
            return res.status(400).send({
                status: false,
                message: "User not found",
            });
        };

        return res.status(200).send({
            status: true,
            message: "Success",
            data: user
        });

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};


// GET ALL USERS
const getAllUsers = async (req, res) => {
    try {
        // let { key } = req.params;

        // if (!key) {
        //     return res.status(400).send({ status: false, message: "key is required"});
        // };

        // if (key !== adminSecretKey) {
        //     return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!"});
        // };

        let users = await userModel.find({});
        return res.status(200).send({
            status: true,
            message: "Success",
            data: users
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};


// DELETE USER
const deleteUser = async (req, res) => {
    try {
        let { userId } = req.params;

        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is required"});
        };

        let user = await userModel.findOne({ userId });

        if (!user) {
            return res.status(400).send({
                status: false,
                message: "User not found",
            });
        };

        const { reason, feedback} = req.body;

        let userAllBookings = await bookingModel.find({ userId });

        let userData = {
            user,
            userAllBookings
        };

        let jsonStr = JSON.stringify(userData);

        await userModel.deleteOne({ userId });

        let deletedUserData = {
            userId,
            deletedUserData: jsonStr,
            reason,
            feedback,
            deletedAt: new Date().toLocaleString()
        };

        await deletedUserModel.create(deletedUserData);

        return res.status(200).send({
            status: true,
            message: "User deleted successfully",
        });

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};



module.exports = {
    authenticateUser,
    updateUser,
    deleteUser,
    getUserById,
    getAllUsers
};
