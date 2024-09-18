const ratingModel = require('../models/ratingModel');
let { getCurrentIPAddress } = require("../uitls/utils");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { port, adminSecretKey } = require("../config/config");
const { isValidObjectId } = require("mongoose");
const logger = require("../config/logger.config");


// ADD RATING
const addRating = async (req, res) => {
    try {
        let { key } = req.params;

        if (!key) {
            return res.status(400).send({
                status: false,
                message: "key is required"
            });
        };

        if (key !== adminSecretKey) {
            return res.status(401).send({
                status: false,
                message: "Not authorized"
            });
        };

        let { name, description, Rating } = req.body;

        let { File_Extension, File_Path, File_data, File_name } = req.body.FileUpload;

        let decodedData = Buffer.from(File_data, "base64");

        // let { picture } = req.files;

        let ratingImgFolder = path.join(__dirname, "..", "..", "ratingImages");

        if (!fs.existsSync(ratingImgFolder)) {
            fs.mkdirSync(ratingImgFolder);
        }

        let currentIpAddress = getCurrentIPAddress();
        let imgRelativePath = "/ratingImages/";
        let imgUniqName = uuid.v4() + File_Extension;
        let imgFullUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
        let imgSavingPath = path.join(__dirname, "..", "..", "ratingImages", imgUniqName);

        fs.writeFileSync(imgSavingPath, decodedData);
        // picture.mv(imgSavingPath, (err) => {
        //     if (err) throw err;
        // });

        let imgObj = {
            imageName: imgUniqName,
            imagePath: imgFullUrl,
        };


        let ratingObj = {
            name,
            description,
            Rating,
            picture: imgObj,
        };

        let newRating = await ratingModel.create(ratingObj);

        return res.status(200).send({
            status: true,
            message: "Rating Added",
            data: newRating,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


module.exports = {
    addRating
};