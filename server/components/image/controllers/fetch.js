const Image = require('../models/image')

function Fetch(req,res){
    Image.find({user : req.user._id}).then(images=>{
        res.json(images)
    })
 }

 module.exports = Fetch