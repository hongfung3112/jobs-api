const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
    // methods: {
    //     getName() {
    //         return this.name;
    //     }
    // }
})

// pre save middleware
UserSchema.pre('save', async function(next) { //use 'function' because 'this' will
    const salt = await bcrypt.genSalt(10)     //always point to this document
    this.password = await bcrypt.hash(this.password, salt)
    next() //this is pre save middleware, so need to use next()
})

// instance methods
UserSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    })
}
// UserSchema.methods.getName = function () {
//     return this.name
// } //same as the methods in schema

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    // compare function pulls the salt out of the hashed password and then 
    // hash candidate password to perform comparison(between hash password)

    return isMatch
}

module.exports = mongoose.model('User', UserSchema)