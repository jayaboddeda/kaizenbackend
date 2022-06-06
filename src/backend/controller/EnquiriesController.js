const res = require('express/lib/response');
const enquirymodel = require('../models/enquiriesmodel');



const createenquiry = async(req,res,next) =>{
await enquirymodel.create(req.body)
res.redirect('/')
}

const getallenquiries = async(req,res) => {
let allenquiries = await enquirymodel.find({});
res.render('enquiries',{
    allenquiries
})

// res.send(allenquiries)
}


module.exports={
    createenquiry,
    getallenquiries
}