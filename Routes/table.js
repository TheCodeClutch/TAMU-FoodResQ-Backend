const router = require("express").Router();
const ExcessFood = require("../Database/model").excessFood;
const GreenFood = require("../Database/model").greenFood;
const User = require('../Database/model').user;
const Restaurant = require('../Database/model').restaurant
const middleware = require("../Helpers/auth-middleware").session;

router.get('/booking/excessFood', middleware, (req, res) => {
    ExcessFood.find({}, async (err, doc) => {
        if(err){
            res.status(400).json({
                error: "There was some error while fetching data"
            })
        } else {
            res.status(200).json({
                message: doc
            })
        }
    })
    .catch(err => {
        res.status(400).json({
            error: "There was some error while fetching data"
        })
    })
})

router.get('/booking/greenFood', middleware, (req, res) => {
    GreenFood.find({}, (err, doc) => {
        if(err){
            res.status(400).json({
                error: "There was some error while fetching data"
            })
        } else {
            res.status(200).json({
                message: doc
            })
        }
    })
    .catch(err => {
        res.status(400).json({
            error: "There was some error while fetching data"
        })
    })
})


router.post('/book', middleware, (req, res) => {
    const email = req.decode.email;
    const foodId = req.body.foodId;
    const restMail = req.body.restMail;
    console.log(email, foodId, restMail)
    let name = ''
    let phone = ''
    let userEmail = ''
    if(req.body.category === "excessFood"){
        User.findOneAndUpdate({
            EMAIL: email
        }, {
            $push: {
                SHOWED_INTENT: {
                    FOOD_ID: foodId,
                    SUCCESSFUL: false,
                    TYPE: "excessFood"
                }
            }
        }, {
            upsert: true
        })
        .then(doc => {
            name = doc.NAME
            phone = doc.PHONE_NUMBER
            userEmail = doc.EMAIL
            Restaurant.findOneAndUpdate({
                EMAIL: restMail
            }, {
                $push: {
                    SHOWED_INTENT: {
                        FOOD_ID: foodId,
                        SUCCESSFUL: false,
                        TYPE: "excessFood"
                    }
                }
            }, {
                upsert: true
            })
            .then(doc => {
                ExcessFood.findOneAndUpdate({
                    ID: foodId
                }, {
                    BOOKED: true,
                    BOOKED_BY_NAME: name,
                    BOOKED_BY_PHONE: phone,
                    BOOKED_BY_EMAIL: userEmail 
                }, {
                    upsert: true
                })
                .then(docp => {
                    res.status(200).json({
                        doc: docp,
                        message: 'Success'
                    })
                })
                .catch( err => {
                    res.status(400).json({
                        err: 'There was some error while fetching the data'
                    })
                })
            })
            .catch(err => {
                res.status(400).json({
                    err: 'There was some error while fetching the data'
                })
            })
        })
        .catch(err => {
            res.status(400).json({
                err: 'There was some error while fetching the data'
            })
        })
    } else {
        User.findOneAndUpdate({
            EMAIL: email
        }, {
            $push: {
                SHOWED_INTENT: {
                    FOOD_ID: foodId,
                    SUCCESSFUL: false,
                    TYPE: "greenFood"
                }
            }
        }, {
            upsert: true
        })
        .then(doc => {
            name = doc.NAME
            phone = doc.PHONE_NUMBER
            userEmail = doc.EMAIL
            Restaurant.findOneAndUpdate({
                EMAIL: restMail
            }, {
                $push: {
                    SHOWED_INTENT: {
                        FOOD_ID: foodId,
                        SUCCESSFUL: false,
                        TYPE: "greenFood"
                    }
                }
            }, {
                upsert: true
            })
            .then(doc => {
                GreenFood.findOneAndUpdate({
                    ID: foodId
                }, {
                    BOOKED: true,
                    BOOKED_BY_NAME: name,
                    BOOKED_BY_PHONE: phone,
                    BOOKED_BY_EMAIL: userEmail 
                }, {
                    upsert: true
                })
                .then(docp => {
                    res.status(200).json({
                        doc: docp,
                        message: 'Success'
                    })
                })
                .catch( err => {
                    res.status(400).json({
                        err: 'There was some error while fetching the data'
                    })
                })
            })
            .catch(err => {
                res.status(400).json({
                    err: 'There was some error while fetching the data'
                })
            })
        })
        .catch(err => {
            res.status(400).json({
                err: 'There was some error while fetching the data'
            })
        })
    }
})

router.post('/filter/excessFood', middleware, (req, res) => {
    const filter = {}
    if(req.body.city){
        filter.RES_CITY = req.body.city
    }
    if(req.body.state){
        filter.RES_STATE = req.body.state
    }
    if(req.body.country){
        filter.RES_COUNTRY = req.body.country
    }
    ExcessFood.find(filter)
    .then(doc => {
        res.status(200).json({
            message: doc
        })
    })
    .catch(err => {
        res.status(400).json({
           error: 'There was some error while filtering'
        })
    })
})

router.post('/filter/greenFood', middleware, (req, res) => {
    const filter = {}
    if(req.body.city){
        filter.RES_CITY = req.body.city
    }
    if(req.body.state){
        filter.RES_STATE = req.body.state
    }
    if(req.body.country){
        filter.RES_COUNTRY = req.body.country
    }
    GreenFood.find(filter)
    .then(doc => {
        res.status(200).json({
            message: doc
        })
    })
    .catch(err => {
        res.status(400).json({
           error: 'There was some error while filtering'
        })
    })
})


module.exports = router;