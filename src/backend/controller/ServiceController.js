
const servicemodel = require('../models/servicemodel')

const submitservice = async(req,res) => {
        let data = {
            ...req.body
        }
    
        await servicemodel.create(data)
    
        res.redirect(`/services`)
}


const getallservices = async(req,res) => {


  let services =   await servicemodel.find({})

    res.render('services',{
        services
    })
}

const getservicebyid = async(req,res) => {
    let formtype= req.query.formtype
    if(formtype == 'edit'){

    let service = await servicemodel.find({_id:req.params.id})

    res.render('addservice',{
        service,
        formtype:'edit'
    })
}else{
    res.render(
        'addservice',{
            formtype:'add'
        }
    )
}

}

const editservicebyid = async(req,res) => {


 await servicemodel.findOneAndUpdate({
        _id: req.params.id},req.body,{new: true}
      );

    res.redirect('/services')
}


    module.exports={
        submitservice,
        getallservices,
        getservicebyid,
        editservicebyid
    }