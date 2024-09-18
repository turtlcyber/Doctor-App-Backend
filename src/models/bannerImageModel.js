const mongoose = require('mongoose');

const bannerImageSchema = new mongoose.Schema({
    bannerImages: [
        {
            imageName: { type: String, default: "" },
            imagePath: { type: String, default: "" }
        }
    ]
}, { timestamps: true });


module.exports = mongoose.model("BannerImage", bannerImageSchema);