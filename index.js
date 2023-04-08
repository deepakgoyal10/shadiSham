// Importing Modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// conntecting to the database
mongoose.connect(
    "mongodb://127.0.0.1:27017/shadisuwidha",
    { useNewUrlParser: true, useUnifiedTopology: true },
    mongoose.set("strictQuery", false)
);


// Setting template Engine
app.set('view engine', 'ejs')
app.set('views', './views')


app.use('/static',express.static('static'))


// setting middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


const user_route = require('./routes/userRoute');


app.use("/", user_route)



const admin_route = require('./routes/adminRoute')

app.use('/admin', admin_route)


app.listen(80, ()=>{
    console.log('Your server is running on localhost port 80')
})