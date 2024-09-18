const express = require('express');
const router = express.Router();

const { 
    createAdmin, 
    adminLogin, 
    getOneDayBookings,
    getOneWeekBookings,
    getOneMonthBookings,
    getOneYearBookings,
    getAllBookingsOfUser,
} = require('../../controllers/adminController');

const { Authentication, Authorization } = require('../../middlewares/auth');

// SIGNUP ADMIN/CONSULTANT
router.post("/api/v1/createSuperAdmin", createAdmin);

// LOGIN ADMIN/CONSULTANT
router.post("/api/v1/loginSuperAdmin", adminLogin);

// GET ONE DAY BOOKINGS (ADMIN API) // date format: 2024-05-02
router.get("/api/v1/getOneDayBookings/:adminId/:sessionToken/:date?", getOneDayBookings);

// GET ONE WEEK BOOKINGS (ADMIN API)
router.get("/api/v1/getOneWeekBookings/:adminId/:sessionToken/:startDate?/:endDate?", getOneWeekBookings);

// GET ONE MONTH BOOKINGS (ADMIN API)
router.get("/api/v1/getOneMonthBookings/:adminId/:sessionToken/:month/:year", getOneMonthBookings);

// GET ONE YEAR BOOKINGS (ADMIN API)
router.get("/api/v1/getOneYearBookings/:adminId/:sessionToken/:year", getOneYearBookings);

// GET ALL BOOKINGS OF AN USER (ADMIN API)
router.get("/api/v1/getUserAllBookings/:adminId/:sessionToken/:userId", getAllBookingsOfUser);


module.exports = router;