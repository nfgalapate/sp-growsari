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

            if(checkEnrollment == null){ //add subject to user
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
    console.log("enrollee" + enrollee);
    var user = await User.findOne({email:enrollee});
    
    res.status(200).json(user.subjects);
})

module.exports = app;