const auth = require("../middleware/auth");
const currentUser = require("../middleware/currentuser");
const express = require('express');
const Subject = require("../model/subject");
const User = require("../model/user");

var app = express.Router();

//function to add subjects to a user (or enroll)
app.post("/enroll", auth, async (req, res) => {
    var enrollee = (currentUser(req,res));
    const {subject_name} = req.body;

    try{
        var subject = await Subject.findOne({subject_name});

        if(subject==null){
            res.send("There is no subject with name " + subject_name)
        } else{
            var s_id = subject._id.toString();
        
            //validate if user is already enrolled
            console.log("in enroll: " + enrollee);
            var checkEnrollment = await User.findOne(
                {email:enrollee},
                {subjects: {$elemMatch: {subject_id: s_id}}}
            );

            console.log(checkEnrollment);

            if(checkEnrollment.subjects.length == 0){ //add subject to user
                var user = await User.updateOne(
                    {email: enrollee},
                    {$push:{subjects: {subject_id: s_id, status: "enrolled"}}}
                );
                res.status(200).send("Congratulations. You have successfully enrolled to " + subject_name);
            } else { //send error if already enrolled
                res.status(400).send("You are already enrolled in " + subject_name);
            }
        }
        
    } catch (err) {
        console.log(err);
    }
    

});

//function to get subjects of user
app.get("/subjects", auth, async(req, res) => { 
    var enrollee = (currentUser(req,res));
    var user = await User.findOne({email:enrollee});
    
    res.status(200).json(user.subjects);
});

app.patch("/subjects", auth, async(req,res) =>{
    const {subject_name, s} = req.body;
    console.log(subject_name);
    var enrollee = (currentUser(req,res));
    try{
        var subject = await Subject.findOne({subject_name});
        if(subject == null){
            res.status(400).send("There is no subject with name " + subject_name);
        } else {
            var s_id = subject._id.toString();
            console.log(s);        

            var checkEnrollment = await User.findOneAndUpdate(
                {email:enrollee, subjects:{$elemMatch:{subject_id: s_id}}},
                {$set: {'subjects.$.status': s}}
            );
            console.log(checkEnrollment);
            res.status(200).send("Successfully updated " + subject_name + " to " + s);
        }
        

    } catch (err){
        console.log(err);
    }
});

module.exports = app;