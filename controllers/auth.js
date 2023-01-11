const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    const user = await User.create({...req.body}) // OR req.body
    const token = user.createJWT()
    // const token = jwt.sign({userId: user._id, name: user.name},'jwtSecret', {
    //     expiresIn: '30d',
    // })
    res
        .status(StatusCodes.CREATED)
        .json({ user: { name: user.name }, token })

    console.log("Successfully register")

    // const { name, email, password } = req.body

    // const salt = await bcrypt.genSalt(10) //10 random bytes in genSalt
    // const hashedPassword = await bcrypt.hash(password, salt)
    // const tempUser = { name, email, password: hashedPassword }

    // const user = await User.create({...tempUser}) // OR tempUser
    // res.status(StatusCodes.CREATED).json({ user })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({ email })
    
    //compare password
    const isPassword = await user.comparePassword(password)
    if (!user || !isPassword) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const token = user.createJWT();
    console.log("Successfully login")
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = {
    register,
    login
}