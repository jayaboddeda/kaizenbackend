const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  patientEmail: {
    type: String,
    required: true,
  },
  patientMobile: {
    type: Number,
    required: true,
  },
  patientGender: {
    type: String,
    require: true,
  },
  patientAge: {
    type: Number,
    required: true,
  },
  appointmentDate: {
    type: String,
    required: true,
  },
  appointmentTime: {
    type: String,
    required: true,
  },
  pastconsultation: {
    type: String,
  },
  preferredDoctor: {
    type: String,
    required: true,
  },
  preferredDepartment: {
    type: String,
    required: true,
  },
  appointmentstatus:{
     type: Boolean, 
     default: false 
  }
},{ timestamps: true });

const appointment = new mongoose.model("appointment", appointmentSchema);
module.exports = appointment;
