const express = require('express')
const router = express.Router()

var Signup = require('../controllers/signup')
var Login = require('../controllers/login')

router
    .route('/signup')
    .post((req,res)=> Signup(req,res))

router
    .route('/login')
    .post((req,res)=> Login(req,res))

module.exports = router
