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
        const{ subject_name, units} = req.body;
        if(subject_name != null && (units != NaN || units > 0)){
            const subject = await Subject.create({
                subject_name,
                units                             
            });
            res.status(200).send("Subject is added to DB");
        } else {
            res.status(400).send("All inputs are required");
        }
    } catch (err){
        
        if(err.code==11000){
            res.status(400).send("Subject already exists");
        } else {
            res.status(400).send(err)
        }
        
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

app.delete('/delete', async(req, res) => {
    const {subject_name} = req.body;
    if(subject_name != null){
        try{
            const deleteSubj = await Subject.deleteOne({subject_name});
            res.status(200).send("Subject " + subject_name + " has been deleted");
        } catch (err) {
            res. status(400).send(err);
        }
    } else {
        res.status(400).send("Subject name is required");
    }
    
})

module.exports = app;