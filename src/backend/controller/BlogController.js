const blogmodel = require('../models/blogmodel');
const doctorsmodel = require('../models/doctormodel')

const createblog = async (req,res) => {
    let blogid = req.params.blogid
if(req.query.type == 1){
    let displayname = req.body.videoname
    let description = "0"
    let doctorid = req.query.doctorid;
    // let videosrc = "../uploads/"+req.filename
    let videosrc = req.body.videourl
    let type = 1


    let data = {
        displayname,
        description,
        doctorid,
        videosrc,
        type
    }


    const createblog = await blogmodel.create(data,function(err,blog){
        if(err){
            console.log(err)
        }
        console.log(blog)
    });


    req.flash("success", "video added");
    res.redirect('/doctorprofile/'+doctorid)


}else{
    if (req.query.formtype == "edit") {
        let data = req.body
        const blog = await blogmodel.findOneAndUpdate({
          _id: blogid},data,{new: true}
        );

    req.flash("success", "blog updated");
    }else {
    const createblog = await blogmodel.create(req.body);
    req.flash("success", "blog created");
    }

    res.send("created")

}

} 


const viewblog = async (req,res) => {
let blogid = req.params.blogid || req.query.blogid
let page = req.query.blogid
let bloginfo = 0
const formtype = req.query.formtype || 0;

     bloginfo = await blogmodel.find({_id : blogid});
    let blogdesc = JSON.parse(bloginfo[0].description)

    let doctorinfo = await doctorsmodel.find({_id:bloginfo[0].doctorid})


    if (formtype) {

        res.render('createblog',{
            bloginfo,
            blogdesc,
            formtype
        })
    }else if(page){
        res.render('blogview',{
            bloginfo,
            blogdesc,
            doctorinfo
        })
    }else{

    res.render('viewblog',{
        bloginfo,
        blogdesc
    })
}

} 

const deleteblogbyid = async(req,res,next) => {
    blogid = req.query.id
    await blogmodel.findOneAndDelete({_id : blogid})
    req.flash("success", "blog deleted");

    res.redirect("/alldoctors")
  
  }

  const getallblogs = async(req,res) => {
      const allblogs = await blogmodel.find({})
      res.render('blog',{
          allblogs
      })
  }
 


module.exports = {
    createblog,
    viewblog,
    deleteblogbyid,
    getallblogs
}

