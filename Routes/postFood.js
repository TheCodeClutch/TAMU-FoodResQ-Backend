const router = require("express").Router();
const ExcessFood = require("../Database/model.js").excessFood;
const GreenFood = require("../Database/model.js").greenFood;
const middleware = require("../Helpers/auth-middleware").session;
const uniqid = require("uniqid");
const axios = require("axios");

router.post("/excessFood", middleware, (req, res) => {
  const email = req.decode.email;
  console.log('Token decoded value', req.decode)
  axios
    .get(
      `https://api.opencagedata.com/geocode/v1/json?q=${req.body.latitude}+${req.body.longitude}&key=${process.env.API_GEOCODER}`
    )
    .then((resp) => {
      const mainData = new ExcessFood({
        ID: uniqid(),
        EMAIL: email,
        DATE: String(new Date()).split(" ").slice(1, 4).join(" "),
        TIME_OPEN: req.body.timeOpen,
        TIME_CLOSE: req.body.timeClose,
        LATITUDE: req.body.latitude,
        LONGITUDE: req.body.longitude,
        CITY: resp.data.results[0].components.city,
        STATE: resp.data.results[0].components.state,
        COUNTRY: resp.data.results[0].components.country,
        FOOD: req.body.food,
        BOOKED: false,
        RES_NAME: req.decode.name,
        RES_STREET: req.decode.street,
        RES_CITY: req.decode.city,
        RES_STATE: req.decode.state,
        RES_COUNTRY: req.decode.country,
      });
      mainData.save((err) => {
        if (err) {
          res.status(400).json({
            error: "There was some error while saving the data",
          });
        } else {
          res.status(200).json({
            message: "Data added successfully",
          });
        }
      });
    });
});


router.post("/greenFood", middleware, (req, res) => {
  const email = req.decode.email;
  axios
  .get(
    `https://api.opencagedata.com/geocode/v1/json?q=${req.body.latitude}+${req.body.longitude}&key=${process.env.API_GEOCODER}`
  )
  .then((resp) => {
    const mainData = new GreenFood({
      ID: uniqid(),
      EMAIL: email,
      DATE: String(new Date()).split(" ").slice(1, 4).join(" "),
      TIME_OPEN: req.body.timeOpen,
      TIME_CLOSE: req.body.timeClose,
      LATITUDE: req.body.latitude,
      LONGITUDE: req.body.longitude,
      CITY: resp.data.results[0].components.municipality,
      STATE: resp.data.results[0].components.state,
      COUNTRY: resp.data.results[0].components.country,
      WEIGHT: req.body.weight,
      BOOKED: false,
      RES_NAME: req.decode.name,
      RES_STREET: req.decode.street,
      RES_CITY: req.decode.city,
      RES_STATE: req.decode.state,
      RES_COUNTRY: req.decode.country,
    });
    mainData.save((err) => {
      if (err) {
        res.status(400).json({
          error: "There was some error while saving the data",
        });
      } else {
        res.status(200).json({
          message: "Data added successfully",
        });
      }
    });
  });
});

module.exports = router;
