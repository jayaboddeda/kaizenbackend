const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    service_name: {
    type: String,
    required: true,
  },
  service_url: {
    type: String,
  },
  service_desc: {
    type: String,
    required: true,
  },
},{ timestamps: true });

const service = new mongoose.model("service", serviceSchema);
module.exports = service ;
