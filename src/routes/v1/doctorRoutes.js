const express = require('express');
const router = express.Router();

const { 
    addDoctor,
    getDoctorById,
    getAllDoctors,
    updateDoctor,
    deleteDoctor
} = require('../../controllers/doctorController');

// ADD DOCTOR
router.post('/api/v1/addDoctor/:key', addDoctor);

// GET DOCTOR BY ID
router.get('/api/v1/getDoctorById/:key/:doctorId', getDoctorById);

// GET ALL DOCTORS
router.get('/api/v1/getAllDoctors/:key', getAllDoctors);

// UPDATE DOCTOR
router.put('/api/v1/updateDoctor/:key/:doctorId', updateDoctor);

// DELETE DOCTOR
router.delete('/api/v1/deleteDoctor/:key/:doctorId', deleteDoctor);


module.exports = router;