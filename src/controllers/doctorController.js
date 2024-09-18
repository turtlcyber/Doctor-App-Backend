const doctorModel = require("../models/doctorModel");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const logger = require("../config/logger.config");
const { isValidObjectId } = require("mongoose");
let { getCurrentIPAddress } = require("../uitls/utils");
let { port, adminSecretKey } = require("../config/config");

// ADD DOCTOR
const addDoctor = async (req, res) => {
    try {
        const { key } = req.params;
        if (!key) {
            return res.status(400).send({
                status: false,
                message: "Key is required",
            });
        };

        if (key !== adminSecretKey) {
            return res.status(401).send({
                status: false,
                message: "Not Authorized",
            });
        };

        const { name, email, phone, experience, description } = req.body;

        let imgObj = null;

        if ("FileUpload" in req.body) {
            let { File_Extension, File_Path, File_data, File_name } = req.body.FileUpload;

            let decodedData = Buffer.from(File_data, "base64");

            // let { profilePic } = req.files;

            let doctorImgFolder = path.join(__dirname, "..", "..", "doctorsImages");

            if (!fs.existsSync(doctorImgFolder)) {
                fs.mkdirSync(doctorImgFolder);
            }

            let currentIpAddress = getCurrentIPAddress();
            let imgRelativePath = "/doctorsImages/";
            let imgUniqName = uuid.v4() + File_Extension;
            let imgFullUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
            let imgSavingPath = path.join(__dirname, "..", "..", "doctorsImages", imgUniqName);

            fs.writeFileSync(imgSavingPath, decodedData);

            // profilePic.mv(imgSavingPath, (err) => {
            //     if (err) throw err;
            // })

            imgObj = {
                fileName: imgUniqName,
                filePath: imgFullUrl,
            };
        };

        let doctorData = {
            name,
            email,
            phone,
            experience,
            description,
            profilePic: imgObj,
        };

        let doctor = await doctorModel.create(doctorData);

        return res.status(201).send({
            status: true,
            message: "Doctor added successfully",
            data: doctor,
        });
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        logger.error(`Error in addDoctor API: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    }
};

// GET DOCTOR BY ID
const getDoctorById = async (req, res) => {
    try {
        let { key, doctorId } = req.params;

        if (!key || !doctorId) {
            return res.status(400).send({
                status: false,
                message: "All fields are required",
            });
        };

        if (key !== adminSecretKey) {
            return res.status(401).send({
                status: false,
                message: "Not Authorized",
            });
        };

        if (!isValidObjectId(doctorId)) {
            return res.status(400).send({
                status: false,
                message: "Invalid doctorId",
            });
        };

        let doctor = await doctorModel.findById(doctorId);

        if (!doctor) {
            return res.status(400).send({
                status: false,
                message: "Doctor not found",
            });
        };

        return res.status(200).send({
            status: true,
            message: "Success",
            data: doctor,
        });
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        logger.error(`Error in getDoctorById API: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    }
};

// GET ALL DOCTORS
const getAllDoctors = async (req, res) => {
    try {
        const { key } = req.params;
        if (!key) {
            return res.status(400).send({
                status: false,
                message: "Key is required",
            });
        }

        if (key !== adminSecretKey) {
            return res.status(401).send({
                status: false,
                message: "Not Authorized",
            });
        }

        let doctors = await doctorModel.find({});

        return res.status(200).send({
            status: true,
            message: "Success",
            data: doctors,
        });
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        logger.error(`Error in getAllDoctors API: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    }
};

// UPDATE DOCTOR
const updateDoctor = async (req, res) => {
    try {
        let { key, doctorId } = req.params;

        if (!key || !doctorId) {
            return res.status(400).send({
                status: false,
                message: "All fields are required",
            });
        }

        if (key !== adminSecretKey) {
            return res.status(401).send({
                status: false,
                message: "Not Authorized",
            });
        }

        if (!isValidObjectId(doctorId)) {
            return res.status(400).send({
                status: false,
                message: "Invalid doctorId",
            });
        }

        let d = await doctorModel.findById(doctorId);

        if (!d) {
            return res.status(400).send({
                status: false,
                message: "Doctor not found",
            });
        }

        let e = req.body;

        if ("name" in e) {
            d.name = e.name;
        }

        if ("email" in e) {
            d.email = e.email;
        }

        if ("phone" in e) {
            d.phone = e.phone;
        }

        if ("experience" in e) {
            d.experience = e.experience;
        }

        if ("description" in e) {
            d.description = e.description;
        }

        if ("FileUpload" in req.body) {
            let oldImgName = d.profilePic.fileName;
            if (oldImgName) {
                let oldImgPath = path.join(__dirname, "..", "..", "doctorsImages", oldImgName);
                if (fs.existsSync(oldImgPath)) {
                    fs.unlinkSync(oldImgPath);
                }
            }

            let { File_Extension, File_Path, File_data, File_name } = req.body.FileUpload;

            let decodedData = Buffer.from(File_data, "base64");

            let currentIpAddress = getCurrentIPAddress();
            let imgRelativePath = "/doctorsImages/";
            let imgUniqName = uuid.v4() + File_Extension;
            let imgFullUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
            let imgSavingPath = path.join(__dirname, "..", "..", "doctorsImages", imgUniqName);

            fs.writeFileSync(imgSavingPath, decodedData);

            let imgObj = {
                fileName: imgUniqName,
                filePath: imgFullUrl,
            };

            d.profilePic = imgObj;
        }

        await d.save();

        return res.status(200).send({
            status: true,
            message: "Doctor details updated",
            data: d,
        });
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        logger.error(`Error in updateDoctor API: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    }
};

// DELETE DOCTOR
const deleteDoctor = async (req, res) => {
    try {
        let { key, doctorId } = req.params;

        if (!key || !doctorId) {
            return res.status(400).send({
                status: false,
                message: "All fields are required",
            });
        }

        if (key !== adminSecretKey) {
            return res.status(401).send({
                status: false,
                message: "Not Authorized",
            });
        }

        if (!isValidObjectId(doctorId)) {
            return res.status(400).send({
                status: false,
                message: "Invalid doctorId",
            });
        }

        let d = await doctorModel.findById(doctorId);

        if (!d) {
            return res.status(400).send({
                status: false,
                message: "Doctor not found",
            });
        }

        let oldImgName = d.profilePic.fileName;
        if (oldImgName) {
            let oldImgPath = path.join(__dirname, "..", "..", "doctorsImages", oldImgName);
            if (fs.existsSync(oldImgPath)) {
                fs.unlinkSync(oldImgPath);
            };
        };

        await doctorModel.deleteOne({ _id: doctorId });

        return res.status(200).send({
            status: true,
            message: 'Doctor details deleted successfully'
        });
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        logger.error(`Error in deleteDoctor API: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = {
    addDoctor,
    getDoctorById,
    getAllDoctors,
    updateDoctor,
    deleteDoctor,
};
