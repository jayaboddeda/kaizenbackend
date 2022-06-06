const express = require("express");
const router = express.Router();
const htmlController = require("../controller/HtmlController");
const multerController = require("../controller/MulterController");
const appointmentController = require("../controller/AppointmentController");
const doctorController = require("../controller/DoctorController");
const authenticationController = require("../controller/AuthenticationController");
const blogController = require("../controller/BlogController");
const enquiryController = require("../controller/EnquiriesController");
const commentController = require("../controller/CommentController");
const serviceController = require("../controller/ServiceController");

router.route("/").get(doctorController.gethomepage);

router
  .route("/submitvideo")
  .post(multerController.uploadfile, htmlController.index);

// router.route("/indextest").get(htmlController.indextest);

router
  .route("/submitappointment")
  .post(appointmentController.submitappointment);

router.route("/appointment").get(appointmentController.getappointmentsbyid);
router.route("/getappointments").get(appointmentController.getappointments);
router.route("/blogtest").get(htmlController.blogtest);

router.route("/blogtestsubmit").post(htmlController.blogtestsubmmit);

// authroutes
router.route("/adminlogin").get(htmlController.login);
router.route("/logout").get(authenticationController.logout);
router.route("/adminlogin").post(authenticationController.login);

//adminroutes
router
  .route("/dashboard")
  .get(authenticationController.checksession, doctorController.dashboard);
router
  .route("/alldoctors")
  .get(authenticationController.checksession, doctorController.alldoctors);
router
  .route("/allpatients")
  .get(authenticationController.checksession, htmlController.allpatients);

router
  .route("/doctorprofile/:doctorid")
  .get(authenticationController.checksession, doctorController.doctorprofile);

router
  .route("/adddoctor")
  .get(authenticationController.checksession, htmlController.doctorform);
router
  .route("/doctorform")
  .post(multerController.uploadfile, doctorController.createdoctor);

router
  .route("/editprofile/:doctorid")
  .get(authenticationController.checksession, doctorController.doctorprofile);


router
  .route("/createblog")
  .get(authenticationController.checksession, htmlController.createblog);

router
  .route("/createblog")
  .post(authenticationController.checksession,multerController.uploadfile,blogController.createblog);

router
  .route("/viewblog/:blogid")
  .get(authenticationController.checksession, blogController.viewblog);

router
  .route("/editblog/:blogid")
  .post(blogController.createblog);

router
  .route("/editblog/:blogid")
  .get(authenticationController.checksession, blogController.viewblog);

router
  .route("/deleteappointment")
  .get(authenticationController.checksession, appointmentController.deleteappointmentbyid);

  router
  .route("/downloadappointments")
  .get(authenticationController.checksession, appointmentController.downloadappointments);

router
  .route("/deleteblog")
  .get(authenticationController.checksession, blogController.deleteblogbyid);

router
  .route("/deletedoctor")
  .get(authenticationController.checksession, doctorController.deletedoctorbyid);

router
  .route("/changepassword/:id")
  .post(authenticationController.checksession, authenticationController.changePassword);

router
  .route("/uploadgalleryimage")
  .post(authenticationController.checksession, multerController.uploadfile,doctorController.uploadgalleryimage);

router
  .route("/deleteimagefromgallery")
  .get(authenticationController.checksession,doctorController.deleteimagefromgallery);


router
  .route("/contact")
  .get(htmlController.enquiry);

router
  .route("/submitcontact")
  .post(enquiryController.createenquiry);

router.route('/getenquiries').get(authenticationController.checksession,enquiryController.getallenquiries)

router.route('/blogs').get(blogController.getallblogs)

router.route('/viewblog').get(blogController.viewblog)
router.route('/comment').post(commentController.submitcomment)

router.route('/index').get(doctorController.gethomepage)

router.route('/services').get( authenticationController.checksession,serviceController.getallservices)

router.route('/addservice').get(authenticationController.checksession, serviceController.getservicebyid)

router.route('/addservice').post(authenticationController.checksession, serviceController.submitservice)
router.route('/editservice/:id').post(authenticationController.checksession, serviceController.editservicebyid)

router
  .route("/addservice/:id")
  .get(authenticationController.checksession, serviceController.getservicebyid);

router.route('/doctor/:doctorid').get(doctorController.doctorprofile)



module.exports = router;
