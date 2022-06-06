const mongoose = require("mongoose");

const enquiriesSchema = new mongoose.Schema({
 firstname:{
    type: String,
    required: true,
 },
 lastname:{
    type: String,
    required: true,
 },
 email:{
    type: String,
    required: true,
 },
 phonenumber:{
     type:Number,
     required:true,
 },
 message:{
     type:String,
     required:true,
 }
},{ timestamps: true });

const enquiry = new mongoose.model("enquiry", enquiriesSchema);
module.exports = enquiry;
