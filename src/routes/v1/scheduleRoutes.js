const express = require('express');
const router = express.Router();

const { 
    createClassSchedule, 
    getAllClassSchedule,
    getSchedule,
    updateSchedule,
    deleteSchedule,

} = require('../../controllers/classScheduleController');

// ADD COURSE PURCHASE DETAILS
router.post("/api/v1/createSchedule/:key", createClassSchedule);

// GET COURSE PURCHASE DETAILS BY ID
router.get("/api/v1/getSchedule/:key/:courseId", getSchedule);

// GET ALL COURSE PURCHASE DETAILS
router.get("/api/v1/getAllClassSchedule/:key", getAllClassSchedule);

// UPDATE COURSE PURCHASE DETAILS BY PURCHASE ID
router.put("/api/v1/updateSchedule/:key/:courseId", updateSchedule);

// DELETE COURSE PURCHASE DETAILS BY PURCHASE ID
router.delete("/api/v1/deletSchedule/:key/:courseId", deleteSchedule);


module.exports = router;