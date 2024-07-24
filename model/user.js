//donor request form

//1 import
const mongoose = require('mongoose');

//2 creating schema
const schema = mongoose.Schema({
    Name : String,
    Age : Number,
    Email : String,
    Contact  : Number,
    Blood_type : String,
    Request_Caterogy : String,
    No_of_units : Number
})

const userModel = mongoose.model("user", schema);
module.exports = userModel;