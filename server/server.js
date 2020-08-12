const app = require('./route')
const mongoose = require('mongoose')
const keys = require("./config/keys")

const db = keys.mongoURI;
const port = keys.PORT

mongoose.connect( db, { 
     useNewUrlParser: true, 
     useUnifiedTopology: true,
     useFindAndModify: false,
     useCreateIndex: true})
 .then(()=>console.log('MongoDB succesfully Connected'))
 .catch(err => console.log(err))


const server = app.listen(port, function() {
    console.log('Server is running on port: ' + port)
   });

module.exports = server;
                            