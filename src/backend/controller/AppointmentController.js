const appointmentmodel = require("../models/appointmentmodel");
const doctormodel = require("../models/doctormodel");
const fastcsv = require("fast-csv");
const fs = require("fs");
const ws = fs.createWriteStream("upcomingappointments.csv");


const submitappointment = async (req, res, next) => {


  await appointmentmodel.create({
    patientName: req.body.patientName.toLowerCase(),
    patientEmail: req.body.patientEmail.toLowerCase(),
    patientMobile: req.body.patientMobile,
    patientGender: req.body.patientGender.toLowerCase(),
    patientAge: req.body.patientAge,
    appointmentDate: req.body.appointmentDate.toLowerCase(),
    appointmentTime: req.body.appointmentTime.toLowerCase(),
    pastconsultation: req.body.pastconsultation.toLowerCase(),
    preferredDoctor: req.body.preferredDoctor.toLowerCase(),
    preferredDepartment: req.body.preferredDepartment.toLowerCase(),
  });
  res.redirect("/");
};

const getappointments = async (req, res, next) => {
  const getappointments = await appointmentmodel.find();

  res.send(getappointments);
};

const getappointmentsbyid = async (req, res, next) => {
  appointmentid = req.query.id || 0
let appointmentinfo = []
let doctors = await doctormodel.find({});

  if(appointmentid){
     appointmentinfo = await appointmentmodel.find({_id:appointmentid});
    res.render('appointment',{
      appointmentinfo,
      doctors
    })
  }else{
    res.render('appointment',{
      appointmentinfo,
      doctors
    })
  }

};

const deleteappointmentbyid = async(req,res,next) => {
  appointmentid = req.query.id
  await appointmentmodel.findOneAndDelete({_id : appointmentid})
  console.log(appointmentid)
  res.redirect("/dashboard")

}


const downloadappointments = async(req,res) => {
  console.log('totalupappointments')

  totalupappointments = await appointmentmodel.find({appointmentstatus:false});

  console.log(totalupappointments)

   fastcsv
  .write(totalupappointments
  , { headers: true ,
    transform: function(row){
      return {
          patientname: row.patientName,
          patientEmail: row.patientEmail,
          patientMobile:row.patientMobile
      };
    }
  })
  .pipe(ws)


  ws.on('finish', function(){

     // Download the file

     res.download("upcomingappointments.csv",() => {

      // Then delete the csv file in the callback
          fs.unlinkSync("upcomingappointments.csv")
        })
  });
    

}

module.exports = {
  submitappointment,
  getappointments,
  getappointmentsbyid,
  deleteappointmentbyid,
  downloadappointments
};
