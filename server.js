const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const Report = require('./models/report')
const dbConfig = require("./db.config")
require('dotenv').config()
const axios = require('axios')
const app = express()
app.use(express.json())
app.use(cors());
const { auth } = require('express-oauth2-jwt-bearer');
const jwtCheck = auth ({
    audience : 'Health api unique Identifier' ,
    issuerBaseURL : "https://dev-t6vu0zserkbj4sda.us.auth0.com", 
    tokenSigningAlg : 'RS256' ,
})

app.use(jwtCheck)


app.post('/api/report' , async(req  , res)=> {
    try {
        const accessToken = req.headers.authorization.split(' ')[1];
        const response = await axios.get('https://dev-t6vu0zserkbj4sda.us.auth0.com/userinfo' , {
            headers : {
                authorization : `Bearer ${accessToken}`
            }
        })

        const userInfo = response.data;
        const email = userInfo.email;
        const report = new report({
            ...req.body ,
            email
        })
        await report.save();
        res.status(201).json(report);
    } catch(error) {
        res.status(500).json({
            message : error.message
        })
    }
})

app.get('/testing' , async (req , res)=> {
    try {
        const accessToken = req.headers.authorization.split(' ')[1];
        const response = await axios.get('https://dev-t6vu0zserkbj4sda.us.auth0.com/userinfo' , {
            headers : {
                authorization : `Bearer ${accessToken}`
            }
        })

        const userInfo = response.data;
        console.log(userInfo);
        res.send(userInfo)
    } catch(error) {
        console.log(error.message);
    }
})

app.get('/api/report' , async(req , res)=> {
    try {
        const accessToken = req.headers.authorization.split(' ')[1];
        const response = await axios.get('https://dev-t6vu0zserkbj4sda.us.auth0.com/userinfo' , {
            headers : {
                authorization : `Bearer ${accessToken}`
            }
        })
        const userInfo = response.data;
        const email = userInfo.email;
        const reports = await Report.find({email});

        const {sortColumn , sortOrder} = req.query;
        let sortedReport = reports;
        if(sortColumn === "name") {
            sortedReport.sort((a , b) =>{
                if(sortOrder === "asc") {
                    return a.name.localeCompare(b.name)
                } else {
                    return b.name.localeCompare(a.name)
                }
            })
        } else if(sortColumn === "date") {
            sortedReport.sort((a , b) =>{
                if(sortOrder === "asc") {
                    return new Date(a.date) - new Date(b.date)
                } else {
                    return new Date(b.date) - new Date(a.date)
                }
            })
        } else if(sortColumn === "time") {
            sortedReport.sort((a , b) =>{
                if(sortOrder === "asc") {
                    return a.time.localeCompare(b.time)
                } else {
                    return b.time.localeCompare(a.time)
                }
            })
        }

    } catch(error) {
        res.status(500).json({ message: error.message });
    }
})


mongoose.connect(process.env.MONGO_URI , dbConfig.options)
    .then(()=>console.log('connected to mongo'))
    .then(error => console.error(error));

app.listen(5000 , ()=> {
    console.log('server is running on port 5000')
})