const router = require("express").Router();
const middleware = require("../Helpers/auth-middleware").session;
const User = require("../Database/model").user
const Restaurant = require("../Database/model").restaurant
const ExcessFood = require("../Database/model").excessFood
const GreenFood = require("../Database/model").greenFood
const async = require("async")

router.post('/user/profile', (req, res) => {
    const email = req.body.email;
    console.log(email)
    User.findOne({
        EMAIL: email
    })
    .then((doc) => {
        if(doc) {
            console.log(doc)
            const docCopy = Object.assign([], doc.SHOWED_INTENT)
            async.forEachOf(docCopy, (value, key, callback) => {
                if(value.TYPE === 'excessFood'){
                    ExcessFood.findOne({FOOD_ID: value.FOOD_ID})
                    .then(doc => {
                        docCopy[key]['OTHER'] = doc
                        callback()
                    })
                    .catch(err => {
                        console.log(err)
                    })
                } else {
                    GreenFood.findOne({FOOD_ID: value.FOOD_ID})
                    .then(doc => {
                        docCopy[key]['OTHER'] = doc
                        callback()
                    })
                    .catch(err => {
                        console.log(err)
                    })
                }
                // fs.readFile(__dirname + value, "utf8", (err, data) => {
                //     if (err) return callback(err);
                //     try {
                //         configs[key] = JSON.parse(data);
                //     } catch (e) {
                //         return callback(e);
                //     }
                //     callback();
                // });
            }, err => {
                if (err){
                    res.status(400).json({
                        error: 'There was some error'
                    })
                }
            });
            res.status(200).json({
                message: docCopy
            })
        }
    })
    .catch(err => {
        res.status(400).json({
            err: 'There was some error while fetching the profile'
        })
    })
})

router.post('/restaurant/profile', (req, res) => {
    const email = req.body.email;
    console.log(email)
    ExcessFood.find({
        EMAIL: email
    })
    .then((ef) => {
       GreenFood.find({
            EMAIL: email
       })
       .then((gf) => {
           res.status(200).json({
               message: 'Success',
               EXCESS_FOOD: ef,
               GREEN_FOOD: gf
           })
       })
       .catch(err => {
            res.status(400).json({
                err: 'There was some error while fetching the profile'
            })
       })
    })
    .catch(err => {
        res.status(400).json({
            err: 'There was some error while fetching the profile'
        })
    })
})

router.get('/restaurant/posts', (req, res) => {
    const email = req.decode.email;
    const data = {}
    ExcessFood.find({
        EMAIL: email
    })
    .then((err, doc) => {
        if(err){
            res.status(400).json({
                err: 'There was some error while fetching the data'
            })
        } else {
            data.EXCESS_FOOD = doc
            GreenFood.find({
                EMAIL: email
            })
            .then((err, doc) => {
                if(err){
                    res.status(400).json({
                        err: 'There was some error while fetching the data'
                    })
                } else {
                    data.GREEN_FOOD = doc
                    res.status(200).json({
                        message: data
                    })
                }
            })
            .catch(err => {
                res.status(400).json({
                    err: 'There was some error while fetching the data'
                })
            })
        }
    })
    .catch(err => {
        res.status(400).json({
            err: 'There was some error while fetching the data'
        })
    })
})

module.exports = router;