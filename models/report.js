const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    email : {
        type : String ,
        required : true
    } , 
    name : {
        type : String ,
        required : true
    } ,
    date : {
        type : Date , 
        required : true
    } ,
    time : {
        type : String ,
        required : true
    } ,
    injuries : [{
        number : {
            type : Number,
            required : true
        } ,
        area : {
            type : String ,
            required : true
        } ,
        x : {
            type : Number ,
            required : true
        } , 
        y : {
            type : Number ,
            required : true
        }
    }]

})

module.exports = mongoose.model('Report' , reportSchema)