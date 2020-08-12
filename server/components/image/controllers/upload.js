const multer = require("multer");
const Image = require('../models/image')
const path = require('path')

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../../../client/public/uploads'),
    filename: function(req, file, cb){
       cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
    }
 });
 
 const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
 }).single("myfile")

function Upload(req,res){
    upload(req, res, () => {
       Image.create({image : req.file,user : req.user._id}).then(image=>{
           res.send(image)
       })
    });
 }

 module.exports = Upload