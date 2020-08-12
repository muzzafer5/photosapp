const Image = require('../models/image')

function Share(req,res)
    {Image.findOneAndUpdate({user : req.user._id, 'image.filename' : req.body.filename},
    {$addToSet:{shared_with : req.body.username}}
    ).then(images=>{
        res.send("shared")
    })
 }

 module.exports = Share