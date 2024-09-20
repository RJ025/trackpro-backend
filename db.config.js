module.exports = {
    uri : process.env.MONGO_URI , 
    database : "myapp" ,
    options : {
        useNewUrlParser : true ,
        useUnifiedTopology : true
    }
}