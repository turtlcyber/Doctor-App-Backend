const express = require('express');
const router = express.Router();

const {
    authenticateUser,
    updateUser,
    getAllUsers,
    getUserById,
    deleteUser, 
    
} = require('../../controllers/userController');

// AUTHENTICATE USER
router.post("/api/v1/authenticateUser", authenticateUser);

// GET USER BY ID
router.get("/api/v1/getUser/:userId/:key", getUserById);

// GET ALL USERS
router.get("/api/v1/users/:key", getAllUsers);

// REGISTER USER
router.post("/api/v1/updateUser/:userId", updateUser);

// DELETE USER BY USER ID
router.delete("/api/v1/deleteUser/:userId", deleteUser);

// GET ALL USERS
router.get("/api/v1/getAllUsers", getAllUsers);


module.exports = router;