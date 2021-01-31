const router = require("express").Router();
const jwt = require('jsonwebtoken');
const User = require('../Database/model.js').user;
const Restaurant = require('../Database/model.js').restaurant;
const helpers = require('../Helpers/helpers.js');
const upload = require('./multer')
const cloudinary = require('./cloudinary')
const fs = require('fs')

// TO SIGNUP USER
router.post('/signup/user', upload.any('image'), async (request, response) => {
    if (!helpers.emailValidate(request.body.email)) {
        response.status(400).json({
            err: 'There was error validating your email id',
            validEmail: false
        });
    } else {
        const uploader = async (path) => await cloudinary.uploads(path, 'ProfileImageUser');
        const urls = []
        const files = request.files;
        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path)
            urls.push(newPath)
            // eslint-disable-next-line security/detect-non-literal-fs-filename
            fs.unlinkSync(path)
        }
        const profile = new User({
            NAME: request.body.name,
            EMAIL: request.body.email,
            PASSWORD: helpers.hashAndReturn(request.body.password),
            PHONE_NUMBER: request.body.phoneNumber,
            PROFILE_PIC: urls[0].url,
            STREET: request.body.street,
            CITY: request.body.city,
            STATE: request.body.state,
            COUNTRY: request.body.country,
            POINTS: 0,
            SPAM: 0,
            SHOWED_INTENT: []
        });
        profile.save((err) => {
            if (err) {
                if (err.code === 11000) {
                    response.status(400).json({
                        err: 'The given email id is already registered with us',
                        alreadyRegistered: true
                    });
                } else {
                    response.status(400).json({
                        err: 'There was some error signing you up',
                    });
                }
            } else {
                response.status(200).json({
                    message: 'You were successfully signed up - User',
                    msgSent : true
                });
            }
        });
    }
})

// TO SIGNUP RESTAURANT
router.post('/signup/restaurant', (request, response) => {
    console.log(request.body)
    if (!helpers.emailValidate(request.body.email)) {
        response.status(400).json({
            err: 'There was error validating your email id',
            validEmail: false
        });
    } else {
        const profile = new Restaurant({
            NAME: request.body.name,
            EMAIL: request.body.email,
            PASSWORD: helpers.hashAndReturn(request.body.password),
            PHONE_NUMBER: request.body.phoneNumber,
            OPENING_TIME: request.body.openingTime,
            CLOSING_TIME: request.body.closingTime,
            STREET: request.body.street,
            CITY: request.body.city,
            STATE: request.body.state,
            COUNTRY: request.body.country,
            POINTS: 0,
            SPAM: 0,
            REC_INTENT: []
        });
        profile.save((err) => {
            if (err) {
                if (err.code === 11000) {
                    response.status(400).json({
                        err: 'The given email id is already registered with us',
                        alreadyRegistered: true
                    });
                } else {
                    response.status(400).json({
                        err: 'There was some error signing you up',
                    });
                }
            } else {
                response.status(200).json({
                    message: 'You were successfully signed up - Restaurant',
                    msgSent : true
                });
            }
        });
    }
})

// TO LOGIN USER
router.post('/login/user', (request, response) => {
    User.findOne({
        EMAIL: request.body.email,
    }, (err, data) => {
        if (err) {
            response.status(400).json({
                err: 'There was error fetching the details',
            });
        } else if (data == null) {
            response.status(400).json({
                err: 'No such user exist try signing up first',
                noSuchUser: true,
            });
        } else {
            if ((helpers.passwordAuth(data.PASSWORD, request.body.password))) {
                const payload = {
                    email: request.body.email,
                };
                const token = jwt.sign(payload, process.env.PW_SECRET);
                response.status(200).json({
                    token,
                    message: 'Success, the password matched successfully - loggedin user',
                });
                return true;
            } else {
                response.status(400).json({
                    err: 'The password entered by the user was wrong',
                    wrongPassword: true
                });
            }
        }
    });
});


// TO LOGIN RESTAURANT
router.post('/login/restaurant', (request, response) => {
    Restaurant.findOne({
        EMAIL: request.body.email,
    }, (err, data) => {
        if (err) {
            response.status(400).json({
                err: 'There was error fetching the details',
            });
        } else if (data == null) {
            response.status(400).json({
                err: 'No such user exist try signing up first',
                noSuchUser: true,
            });
        } else {
            if ((helpers.passwordAuth(data.PASSWORD, request.body.password))) {
                const payload = {
                    email: data.EMAIL,
                    name: data.NAME,
                    street: data.STREET,
                    city: data.CITY,
                    state: data.STATE,
                    country: data.COUNTRY
                };
                const token = jwt.sign(payload, process.env.PW_SECRET);
                response.status(200).json({
                    token,
                    message: 'Success, the password matched successfully - loggedin restaurant',
                });
                return true;
            } else {
                response.status(400).json({
                    err: 'The password entered by the user was wrong',
                    wrongPassword: true
                });
            }
        }
    });
});


module.exports = router;
