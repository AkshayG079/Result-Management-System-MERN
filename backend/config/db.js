const mongoose = require('mongoose');

exports.connectToDatabase = () => {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("Connected To Database");
    }).catch((error) => {
        console.log(error);
    })
}