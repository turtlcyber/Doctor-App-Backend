const bookingModel = require("../models/bookingModel");
const userModel = require("../models/userModel");
let { getCurrentIPAddress } = require("../uitls/utils");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { port, adminSecretKey } = require("../config/config");
const { isValidObjectId } = require("mongoose");

// CREATE BOOKING
const createBooking = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).send({ status: false, message: "User Id is required" });
        }

        let user = await userModel.findOne({ userId });

        if (!user) {
            return res.status(404).send({ status: false, message: "User Not Found" });
        }

        let { appointment_date, notes, doctor_name, doctor_id, slot } = req.body;

        let checkBookingSlot = await bookingModel.findOne({
            appointment_date,
            doctor_name,
            doctor_id,
            slot
        });

        if (checkBookingSlot) {
            return res.status(400).send({ 
                status: false, 
                message: "The doctor already has an appointment for given date and slot"
            });
        };

        let bookingId;
        let isBookingAlreadyExist;
        do {
            bookingId = Math.floor(100000 + Math.random() * 899999);
            isBookingAlreadyExist = await bookingModel.findOne({ bookingId: bookingId });
        } while (isBookingAlreadyExist);

        let imgObj = null;
        if ("notes_file" in req.body) {
            let { File_Extension, File_Path, File_data, File_name } = req.body.notes_file;

            let decodedData = Buffer.from(File_data, "base64");

            // let { notes_file } = req.files;

            let bookingImgFolder = path.join(__dirname, "..", "..", "bookings");

            if (!fs.existsSync(bookingImgFolder)) {
                fs.mkdirSync(bookingImgFolder);
            }

            let currentIpAddress = getCurrentIPAddress();
            let imgRelativePath = "/bookings/";
            let imgUniqName = uuid.v4() + File_Extension;
            let imgFullUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
            let imgSavingPath = path.join(__dirname, "..", "..", "bookings", imgUniqName);

            fs.writeFileSync(imgSavingPath, decodedData);

            // notes_file.mv(imgSavingPath, (err) => {
            //     if (err) throw err;
            // })

            imgObj = {
                fileName: imgUniqName,
                filePath: imgFullUrl,
            };
        }

        let bookingObj = {
            userId,
            bookingId,
            appointment_date,
            notes,
            notes_file: imgObj,
            doctor_name,
            doctor_id,
            slot,
        };

        let newBooking = await bookingModel.create(bookingObj);

        return res.status(200).send({
            status: true,
            message: "Booking created successfully",
            data: newBooking,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

// GET ALL BOOKINGS OF A USER BY USER ID
const getUserAllBookings = async (req, res) => {
    try {
        let { userId } = req.params;
        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is required" });
        }

        let user = await userModel.findOne({ userId });

        if (!user) {
            return res.status(404).send({ status: false, message: "User Not Found" });
        }

        let allBookingsOfAUser = await bookingModel.find({ userId: user.userId });

        return res.status(200).send({
            status: true,
            message: "Success",
            data: allBookingsOfAUser,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

// GET ALL BOOKINGS
const getAllBookings = async (req, res) => {
    try {
        let { key } = req.params;

        if (!key) {
            return res.status(400).send({ status: false, message: "Key is required" });
        }

        if (key === adminSecretKey) {
            let allBookings = await bookingModel.find({});

            return res.status(200).send({
                status: true,
                message: "Success",
                data: allBookings,
            });
        } else {
            return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!" });
        }
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

// GET ALL SLOTS OF A PERTICULAR DATE
const getAllSlotsOfADate = async (req, res) => {
    try {
        let { date } = req.params;
        if (!date) {
            return res.status(400).send({ status: false, message: "Date is required" });
        }

        let allBookings = await bookingModel.find({ appointment_date: date });

        let timeSlotArr = [];
        if (allBookings.length) {
            for (let booking of allBookings) {
                timeSlotArr.push(booking.slot);
            }
        }

        return res.status(200).send({
            status: true,
            message: "Success",
            date: date,
            bookedSlots: timeSlotArr,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

// GET SPECIFIC BOOKING OF AN USER
const getSpecificBooking = async (req, res) => {
    try {
        let { bookingId } = req.params;
        if (!bookingId) {
            return res.status(400).send({ status: false, message: "bookingId is required" });
        }

        let booking = await bookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).send({
                status: false,
                message: "No booking found with this booking id",
            });
        }

        return res.status(200).send({
            status: true,
            message: "Success",
            data: booking,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

// UPDATE BOOKING STATUS
const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;

        if (!bookingId) {
            return res.status(400).send({ status: false, message: "Booking Id is required" });
        }

        const { status, question, feedback } = req.body;

        if (!status) {
            return res.status(400).send({ status: false, message: "status is required" });
        }

        if (!isValidObjectId(bookingId)) {
            return res.status(400).send({ status: false, message: "Invalid Booking Id" });
        }

        let booking = await bookingModel.findById(bookingId);

        if (!booking) {
            return res.status(200).send({ status: true, message: "Booking Not Found" });
        }

        booking.booking_status = status;
        booking.question = question ? question : "";
        booking.feedback = feedback ? feedback : "";

        await booking.save();

        return res.status(200).send({
            status: true,
            message: "Booking status updated successfully",
            data: booking,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

// SUBMIT OR UPDATE BOOKING BY DOCTOR
const submitBookingByDoctor = async (req, res) => {
    try {
        const { bookingId } = req.params;

        if (!bookingId) {
            return res.status(400).send({ status: false, message: "Booking Id is required" });
        }

        let booking = await bookingModel.findById(bookingId);

        if (!booking) {
            return res.status(400).send({ status: false, message: "Booking not found" });
        }

        let e = req.body;

        booking.doctorInstructions = e.doctorInstructions;
        booking.next_appointment_date = e.next_appointment_date;

        await booking.save();

        return res.status(200).send({
            status: true,
            message: "Booking submitted successfully",
            data: booking,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

// UPDATE BOOKING FILES BY DOCTOR
const updateBookingFilesByDoctor = async (req, res) => {
    try {
        let { bookingId } = req.params;

        if (!bookingId) {
            return res.status(400).send({ status: false, message: "Booking Id is required" });
        }

        let booking = await bookingModel.findById(bookingId);

        if (!booking) {
            return res.status(400).send({ status: false, message: "Booking not found" });
        }

        let { ImageModel } = req.body;

        let parsedData = JSON.parse(ImageModel);

        let { file } = req.files;

        if (!file) {
            return res.status(400).send({ status: false, message: "No file uploaded" });
        }

        let index = parsedData.index; //{"isNewPick":false,"index":1,"img_id":"64ffebc1f3bfc5d77220193b","imageName":"1694493633669-432139964.jpg"}
        let img_id = parsedData.img_id ? parsedData.img_id : "";
        let imageName = parsedData.imageName;
        let isNewPick = parsedData.isNewPick;

        let currentIpAddress = getCurrentIPAddress();
        let imgRelativePath = "/bookings/";
        let imgUniqName = uuid.v4() + "." + file.name.split(".").pop();
        let imgFullUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
        let imgSavingPath = path.join(__dirname, "..", "..", "bookings", imgUniqName);

        if (!isNewPick) {
            let oldImage = booking.files[index].fileName;
            if (oldImage) {
                let oldImgPath = path.join(__dirname, "..", "..", "bookings", oldImage);
                if (fs.existsSync(oldImgPath)) {
                    fs.unlinkSync(oldImgPath);
                }
            }

            file.mv(imgSavingPath, (err) => {
                if (err) throw err;
            });

            let updatedFileObj = {
                fileName: imgUniqName,
                filePath: imgFullUrl,
            };

            booking.files[index] = updatedFileObj;

            await booking.save();

            return res.status(200).send({
                status: true,
                message: "Booking file uploaded successfully",
                data: booking,
            });
        } else {
            file.mv(imgSavingPath, (err) => {
                if (err) throw err;
            });

            let newFileObj = {
                fileName: imgUniqName,
                filePath: imgFullUrl,
            };

            booking.files.push(newFileObj);

            await booking.save();

            return res.status(200).send({
                status: true,
                message: "Booking file uploaded successfully",
                data: booking,
            });
        }
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

module.exports = {
    createBooking,
    getAllSlotsOfADate,
    getUserAllBookings,
    getAllBookings,
    getSpecificBooking,
    updateBookingStatus,
    submitBookingByDoctor,
    updateBookingFilesByDoctor,
};
