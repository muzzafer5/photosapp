const express = require('express')
const router = express.Router()

const RequireLogin = require('../../../middleware/require_login')

const Upload = require('../controllers/upload')
const Fetch = require('../controllers/fetch')
const Share = require('../controllers/share')

router
    .route('/upload')
    .post(RequireLogin,(req,res)=> Upload(req,res))

router
    .route('/fetch')
    .get(RequireLogin,(req,res)=> Fetch(req,res))

router
    .route('/share')
    .get(RequireLogin,(req,res)=> Share(req,res))

module.exports = router
