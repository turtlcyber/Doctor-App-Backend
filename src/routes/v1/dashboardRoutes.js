const express = require('express');
const router = express.Router();

const { getDashboard, updateBannerImages, deleteBannerImage } = require('../../controllers/dashboard');

// GET DASHBOARD
router.get("/api/v1/getDashboard/:key/:userId?", getDashboard);

// ADD/UPDATE BANNER IMAGES
router.put("/api/v1/addOrUpdateBanner/:key", updateBannerImages);

// DELETE BANNER IMAGE
router.delete("/api/v1/deleteBanner/:imageId/:key", deleteBannerImage);


module.exports = router;