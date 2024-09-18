const express = require('express');
const router = express.Router();

const { 
    addRating
} = require('../../controllers/ratingController');

// ADD RATING TO A HOSPITAL
router.post("/api/v1/addRating/:key", addRating);



module.exports = router;