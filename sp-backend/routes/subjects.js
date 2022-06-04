const express = require("express");
const bodyParser = require("body-parser");
const Subject = require("../model/subject");
const auth = require("../middleware/auth");
const currentUser = require("../middleware/currentuser");

var app = express.Router();

app.use(bodyParser.json());


//logic for adding a new subject
app.post("/add", async (req, res) =>{
    try {
        const{ subject_name, units, status, activities } = req.body;
        if(subject_name != null && (units != NaN || units > 0)){
            const subject = await Subject.create({
                subject_name,
                units,
                status,
                activities
            });
            res.status(200).send("Subject is added to DB");
        } else {
            res.status(400).send("All inputs are required except for activities.");
        }
    } catch (err){

    }
});

app.get("/", async(req, res) =>{
    try{
        const allSubjects = await Subject.find();
        res.status(200).json(allSubjects);
    } catch (err) {
        console.log(err);
    }
    
});

module.exports = app;