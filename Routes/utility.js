const router = require("express").Router();
const middleware = require("../Helpers/auth-middleware").session;
const User = require("../Database/model").user;
const Restaurant = require("../Database/model").restaurant;
const ExcessFood = require("../Database/model").excessFood;
const GreenFood = require("../Database/model").greenFood;
const async = require("async");

router.post("/user/profile", middleware, (req, res) => {
    let email = req.body.email;
  if(!email){
    email = req.decode.email
  }
  console.log(email);
  User.findOne({
    EMAIL: email,
  })
    .then((doc) => {
      if (doc) {
          const docCopy = []
        function queryDB(index) {
            if(doc.SHOWED_INTENT[index].TYPE === "excessFood"){
                ExcessFood.findOne({ ID: doc.SHOWED_INTENT[index].FOOD_ID })
                .then((resp) => {
                    docCopy[index] = [resp, doc.SHOWED_INTENT[index]];
                    if(index + 1 === doc.SHOWED_INTENT.length){
                        res.status(200).json({
                            message: docCopy
                        })
                    } else {
                        queryDB(index + 1);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            } else {
                GreenFood.findOne({ ID: doc.SHOWED_INTENT[index].FOOD_ID })
                .then((resp) => {
                    docCopy[index] = [resp, doc.SHOWED_INTENT[index]];
                    if(index + 1 === doc.SHOWED_INTENT.length){
                        res.status(200).json({
                            message: docCopy
                        })
                    } else {
                        queryDB(index + 1);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        }

        queryDB(0)

      }
    })
    .catch((err) => {
      res.status(400).json({
        err: "There was some error while fetching the profile",
      });
    });
});

router.post("/restaurant/profile", middleware, (req, res) => {
  let email = req.body.email;
  if(!email){
    email = req.decode.email
  }
  console.log(email);
  ExcessFood.find({
    EMAIL: email,
  })
    .then((ef) => {
      GreenFood.find({
        EMAIL: email,
      })
        .then((gf) => {
          res.status(200).json({
            message: "Success",
            EXCESS_FOOD: ef,
            GREEN_FOOD: gf,
          });
        })
        .catch((err) => {
          res.status(400).json({
            err: "There was some error while fetching the profile",
          });
        });
    })
    .catch((err) => {
      res.status(400).json({
        err: "There was some error while fetching the profile",
      });
    });
});

router.get("/restaurant/posts", (req, res) => {
  const email = req.decode.email;
  const data = {};
  ExcessFood.find({
    EMAIL: email,
  })
    .then((err, doc) => {
      if (err) {
        res.status(400).json({
          err: "There was some error while fetching the data",
        });
      } else {
        data.EXCESS_FOOD = doc;
        GreenFood.find({
          EMAIL: email,
        })
          .then((err, doc) => {
            if (err) {
              res.status(400).json({
                err: "There was some error while fetching the data",
              });
            } else {
              data.GREEN_FOOD = doc;
              res.status(200).json({
                message: data,
              });
            }
          })
          .catch((err) => {
            res.status(400).json({
              err: "There was some error while fetching the data",
            });
          });
      }
    })
    .catch((err) => {
      res.status(400).json({
        err: "There was some error while fetching the data",
      });
    });
});

module.exports = router;
