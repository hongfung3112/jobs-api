const express = require('express')
const router = express.Router()
const rateLimiter = require('express-rate-limit')
const { login, register } = require('../controllers/auth')

const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per wimdowMs
    message: {
        msg: 'Too many requests from this IP, please try again after 15 minutes',
    },
})

router.post('/register', apiLimiter, register)
router.post('/login', apiLimiter, login)

module.exports = router