const express=require('express')
const bodyParser = require('body-parser')

const app = express()

/* Allow larger requests*/
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: false
  }));
app.use(bodyParser.json({limit: "50mb"}));

const auth = require("./components/auth/routes/auth")
const image = require("./components/image/routes/image")

app.use("/auth", auth)
app.use("/image",image)

app.get('/', (req, res) => {res.send('Photos')})
module.exports = app

//export default app
