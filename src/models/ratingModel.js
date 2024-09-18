const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    name: { type: String },
    picture: {
		imageName: { type: String },
		imagePath: { type: String }
	},
    description: { type: String },
	Rating: { type: String }
}, { timestamps: true });


module.exports = mongoose.model("Rating", ratingSchema);