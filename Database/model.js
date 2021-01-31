const mongoose = require('mongoose');

const user = new mongoose.Schema({
    NAME: {
        type: String
    },
    EMAIL: {
        type: String
    },
    PASSWORD: {
        type: String
    },
    PHONE_NUMBER: {
        type: Number
    },
    PROFILE_PIC: {
        type: String
    },
    STREET: {
        type: String
    },
    CITY: {
        type: String
    },
    STATE: {
        type: String
    },
    COUNTRY: {
        type: String
    },
    POINTS: {
        type: Number
    },
    SPAM: {
        type: Number
    },
    SHOWED_INTENT: {
        type: [{
            FOOD_ID: String,
            SUCCESSFUL: Boolean,
            TYPE: String
        }]
    }
});

const restaurant = new mongoose.Schema({
    NAME: {
        type: String
    },
    EMAIL: {
        type: String
    },
    PASSWORD: {
        type: String
    },
    PHONE_NUMBER: {
        type: Number
    },
    OPENING_TIME: {
        type: String
    },
    CLOSING_TIME: {
        type: String
    },
    STREET: {
        type: String
    },
    CITY: {
        type: String
    },
    STATE: {
        type: String
    },
    COUNTRY: {
        type: String
    },
    POINTS: {
        type: Number
    },
    SPAM: {
        type: Number
    },
    REC_INTENT: {
        type: [{
            FOOD_ID: String,
            SUCCESSFUL: Boolean,
            TYPE: String
        }]
    }
});

const excessFood = new mongoose.Schema({
    ID: {
        type: String
    },
    RES_NAME: {
        type: String
    },
    RES_STREET: {
        type: String
    },
    RES_CITY: {
        type: String
    },
    RES_COUNTRY: {
        type: String
    },
    RES_STATE: {
        type: String
    },
    EMAIL: {
        type: String
    },
    DATE: {
        type: String
    },
    TIME_OPEN: {
        type: String
    },
    TIME_CLOSE: {
        type: String
    },
    LATITUDE: {
        type: String
    },
    LONGITUDE: {
        type: String
    },
    CITY: {
        type: String
    },
    STATE: {
        type: String
    },
    COUNTRY: {
        type: String
    },
    FOOD: [{
        NAME: String,
        WEIGHT: Number
    }],
    BOOKED: {
        type: Boolean
    },
    BOOKED_BY_NAME: {
        type: String
    },
    BOOKED_BY_PHONE: {
        type: String
    },
    BOOKED_BY_EMAIL: {
        type: String
    }
});


const greenFood = new mongoose.Schema({
    ID: {
        type: String
    },
    RES_NAME: {
        type: String
    },
    RES_STREET: {
        type: String
    },
    RES_CITY: {
        type: String
    },
    RES_COUNTRY: {
        type: String
    },
    RES_STATE: {
        type: String
    },
    EMAIL: {
        type: String
    },
    DATE: {
        type: String
    },
    TIME_OPEN: {
        type: String
    },
    TIME_CLOSE: {
        type: String
    },
    LATITUDE: {
        type: String
    },
    LONGITUDE: {
        type: String
    },
    CITY: {
        type: String
    },
    STATE: {
        type: String
    },
    COUNTRY: {
        type: String
    },
    WEIGHT: {
        type: Number
    },
    BOOKED: {
        type: Boolean
    },
    BOOKED_BY_NAME: {
        type: String
    },
    BOOKED_BY_PHONE: {
        type: String
    },
    BOOKED_BY_EMAIL: {
        type: String
    }
});


module.exports.greenFood = mongoose.model('greenFood', greenFood);
module.exports.excessFood = mongoose.model('excessFood', excessFood);
module.exports.restaurant = mongoose.model('restaurant', restaurant);
module.exports.user = mongoose.model('user', user);
