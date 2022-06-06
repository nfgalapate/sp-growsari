const auth = require("../middleware/auth");
const currentUser = require("../middleware/currentuser");
const bodyParser = require("body-parser");
const express = require('express');
const Activity = require("../model/activity");
const Subject = require("../model/subject");

var app = express.Router();
app.use(bodyParser.json());

//function to get user's activities
app.get("/", auth, async (req, res) => {
    
    try{
        var findUserActivities = await Activity.find({student: currentUser(req,res)});
        res.status(200).send(findUserActivities);
    } catch (err) {
        res.status(400).send(err);
    }

});

app.post("/add", auth, async(req, res) => {
    const {activity_name, subject, status} = req.body;
    student = currentUser(req,res);
    if(activity_name!=null && subject!=null){
        var findSubject = await Subject.findOne({subject_name: subject});
        if(findSubject==null){
            res.send("There is no subject with name " + subject);
        } else {
            try{
                const activity = await Activity.create({
                    activity_name,
                    subject,
                    student,
                    status
                });
    
                res.status(200).send("Activity has been successfully added!");
            } catch(err) {
                if(err.code==11000){
                    res.status(400).send("Activity Name must be unique.");
                } else {
                    res.status(400).send(err);
                }
                
            }
        }
    }

});

app.patch("/update", auth, async(req, res) => {
    const {activity_name, status} = req.body;
    if(activity_name != null && status != null){
        try{
            var findActivity = await Activity.findOne({activity_name});
            if(findActivity==null){
                res.status(400).send("Activity does not exist.");
                
            } else {
                if(currentUser(req,res) == findActivity.student){
                    var updateActivity = await Activity.findOneAndUpdate
                    (
                        {activity_name},
                        {$set: {status: status}}
                    );
                    res.status(200).send("You have successfully updated " + activity_name);
                } else {
                    res.status(400).send("You are not authorized to update this activity");
                }    
            }
        } 
        catch (err){
            console.log(err);
            res.status(400).send(err);
        }    
    } else {
        res.status(400).send("Activity name and status are required to update an activity");
    }
});

app.delete("/delete", auth, async(req, res) => {
    const {activity_name} = req.body;
    if(activity_name!=null){
        try {
            const findActivity = await Activity.findOne({activity_name});
            if(findActivity!=null){
                if(findActivity.student == currentUser(req,res)){
                    const deleteActivity = await Activity.deleteOne({activity_name});
                    res.status(200).send("You have successfully deleted " + activity_name);
                } else {
                    res.status(400).send("You are not authorized to delete this activity");
                }
            } else {
                res.status(400).send("Activity does not exist")
            }
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    }
    
    
});



module.exports = app;