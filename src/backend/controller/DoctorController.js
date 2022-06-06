const doctormodel = require("../models/doctormodel");
const appointmentsmodel = require("../models/appointmentmodel");
const blogmodel = require('../models/blogmodel');
const gallerymodel = require('../models/gallerymodel');
const reviewmodel = require('../models/reviewmodel');
const servicemodel = require('../models/servicemodel');
const moment = require('moment')
const fs = require("fs");
var path = require("path");
const axios = require("axios");
const console = require("console");




const createdoctor = async (req, res, next) => {
  console.log("req.body------------------------------------------------------------")

  console.log(req.body)
  console.log("req.body")
  if (req.body.formtype == "edit") {

    if(req.body.imgsrc){
      const doctor = await doctormodel.find({ _id: req.body.doctorid});
      var file = path.basename("src/client/staticfiles/uploads/"+doctor[0].imgsrc);
      console.log(file)
      if(file != 'uploads'){
        if(doctor[0].imgsrc != 'undefined'){
          fs.unlinkSync("src/client/staticfiles/uploads/"+doctor[0].imgsrc)
        }
    // if(doctor[0].doctorbanner != 'undefined'){
    //   fs.unlinkSync("src/client/staticfiles/uploads/"+doctor[0].doctorbanner)
    // } 
    // if(doctor[0].doc_profile != 'undefined') {
    //   fs.unlinkSync("src/client/staticfiles/uploads/"+doctor[0].doc_profile)
    // }
  }
    }
    let data = req.body
    const doctor = await doctormodel.findOneAndUpdate({
      _id: req.body.doctorid},data,{new: true}
    );
    await getreviewsfromapi(req.body.placeid,req.body.doctorid)
    req.flash("success", "user updated");
    if(req.session.user.role == 0){
    req.session.user = doctor;
    } else if(req.session.user.role == 1 && req.body.role == 1){
      req.session.user = doctor;
    }

    res.send('doctor updated')


    // if (doctor) {
    //   console.log(doctor);
    //   console.log(req.body); 
    //   doctor.firstName = req.body.firstName;
    //   await doctor.save();

    //   res.render('all-doctors')


    // }
  } else {
    const createdoctor = await doctormodel.create(req.body);
    await getreviewsfromapi(req.body.placeid,createdoctor._id)

    req.flash("success", "user created");

    res.send('doctor added')
  }

};

const getreviewsfromapi = async (placeid,doctorid) =>{

  var axios = require('axios');

var config = {
  method: 'get',
  url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeid}&key=AIzaSyBQzlSrA2UHL-QncIlFX_kvGTNf1c5OIOU`
};

axios(config)
.then(async function (response) {
  // console.log(JSON.stringify(response.data.result.reviews));
  let result = response.data.result.reviews;

  let data
  for(let i=0; i< result.length; i++){
    data ={
      name:result[i].author_name,
      text:result[i].text,
      image:result[i].profile_photo_url,
      doctorid
    }
    console.log(data)
    await reviewmodel.create(data)
  }
})
.catch(function (error) {
  console.log(error);
});

}

const dashboard = async (req, res, next) => {
  let totaldoctors,totalappointments,upcomingappointments=[],completedappointments=[],doctorinfo,blogs

  if(req.session.user.role == 0){
    let userid = req.session.user._id
    totalblogs = await blogmodel.find({doctorid:userid}).count();
    totalappointments = await appointmentsmodel.find({_id:userid});
  }else{
    totaldoctors = await doctormodel.find({"role":0,"visibility":true}).count();
   totalappointments = await appointmentsmodel.find({});
  }

  let appointments = await getappointments(totalappointments);

upcomingappointments =  appointments.upcomingappointments 
completedappointments = appointments.completedappointments

  // for(let i=0; i<totalappointments.length; i++){
  //   let appointmentdate  = totalappointments[i].appointmentDate +" "+ totalappointments[i].appointmentTime
  //   let curentdate = moment().format('DD/MM/YYYY','DD/MM/YYYY')
  //   if(moment(appointmentdate, "DD/MM/YYYY").isAfter(moment(curentdate, "DD/MM/YYYY"))){
  //     upcomingappointments.push(totalappointments[i])
  //   }else{
  //     if(totalappointments[i].appointmentstaus == false){
  //     let updateapp = await appointmentsmodel.find({_id: totalappointments[i]._id});

  //     updateapp.appointmentstatus = true
  //     await updateapp.save();
  //     }
  //     completedappointments.push(totalappointments[i])

  //   }
  // }


if(req.session.user.role == 0){
  res.render("doctors-dashboard", {
    totalappointments,
    totalblogs,
    upcomingappointments,
    completedappointments
  });

}else if(req.query.id){
  res.render("doctor-profile", {
    doctorinfo,
    blogs 
  });
}else{
  res.render("doctors-dashboard", { 
    totalappointments,
    totaldoctors,
    upcomingappointments,
    completedappointments
  });
}

};

const alldoctors = async (req, res, next) => {
  if(req.session.user.role == 1){
  const totaldoctors = await doctormodel.find({'role':0,'visibility':true});
  res.render("all-doctors", {
    totaldoctors,
  });
}else{
  res.redirect('/doctorprofile/'+req.session.user._id)
}
};

const doctorprofile = async (req, res) => {
  const doctorid = req.params.doctorid;
  const formtype = req.query.formtype || 0;
  const page = req.query.page || 0;
let upcomingappointments=[],completedappointments=[]


    const doctorinfo = await doctormodel.find({ _id: doctorid });
    const blogs =  await blogmodel.find({doctorid : doctorid})
    const totalappointments = await appointmentsmodel.find({_id:doctorid});
    const galleryimages = await gallerymodel.find({doctorid})
    const appointments = await getappointments(totalappointments)
    upcomingappointments =  appointments.upcomingappointments 
completedappointments = appointments.completedappointments
const reviews = await reviewmodel.find({doctorid})
const services = await servicemodel.find({doctorid})

console.log("reviews")
console.log(reviews)

  if (formtype) {
    res.render("doc_form", {
      doctorinfo,
      services
    });
  }else if(page){
    res.render("doctor", {
      doctorinfo,
      blogs,
      galleryimages,
      reviews,
      services
    });
  } else {
    res.render("doctor-profile", {
      doctorinfo,
      blogs ,
      upcomingappointments,
      completedappointments,
      galleryimages
    });
  }
};

const getappointments = async(totalappointments) => {
  console.log(totalappointments)
  let upcomingappointments=[],completedappointments=[]
  for(let i=0; i<totalappointments.length; i++){
    let appointmentdate  = totalappointments[i].appointmentDate +" "+ totalappointments[i].appointmentTime
    console.log(appointmentdate)
    let curentdate = moment().format('DD/MM/YYYY hh:mm')
    console.log(curentdate)
    if(moment(appointmentdate, "DD/MM/YYYY hh:mm").isAfter(moment(curentdate, "DD/MM/YYYY hh:mm"))){
      upcomingappointments.push(totalappointments[i])
    }else{
      if(totalappointments[i].appointmentstaus == false){
      let updateapp = await appointmentsmodel.find({_id: totalappointments[i]._id});

      updateapp.appointmentstatus = true
      await updateapp.save();
      }
      completedappointments.push(totalappointments[i])

    }
  }
  return {
    upcomingappointments,
    completedappointments
  }
}

const deletedoctorbyid = async(req,res,next) => {
  doctorid = req.query.id
  let user = await doctormodel.findOne({_id : doctorid})

  user.visibility = false
  user.save()
  console.log(user)
  res.redirect("/alldoctors")
}


const uploadgalleryimage = async(req,res)=>{
  let doctorid = req.query.doctorid
 let image = await gallerymodel.create({
    imgsrc:req.filename,
    doctorid,
    privateimg:req.body.privateimg
  })
  image.save();
  req.flash("success", "image uploaded");
  res.redirect('/doctorprofile/'+doctorid)
}

const deleteimagefromgallery = async(req,res)=>{
  let doctorid = req.query.doctorid
  let imageid = req.query.imageid
  let imagename = req.query.imagename

  await gallerymodel.findOneAndDelete({_id : imageid})
  fs.unlinkSync("src/client/staticfiles/uploads/"+ imagename)
  req.flash("success", "image deleted");
  res.redirect('/doctorprofile/'+doctorid)

}

const gethomepage = async (req,res) => {

  let images = await gallerymodel.find({})
  let blogs = await blogmodel.find({})
  let reviews = await reviewmodel.find({})
  let doctors = await doctormodel.find({})


  res.render('index',{
    images,
    blogs,
    reviews,
    doctors
  })

}

module.exports = {
  createdoctor,
  dashboard,
  alldoctors,
  doctorprofile,
  deletedoctorbyid,
  uploadgalleryimage,
  deleteimagefromgallery,
  gethomepage
};
