const auth = require("../middleware/auth");
const currentUser = require("../middleware/currentuser");
const express = require('express');
const Subject = require("../model/subject");
const User = require("../model/user");
const { deleteOne } = require("../model/user");

var app = express.Router();

//function to add subjects to a user (or enroll)
app.post("/enroll", auth, async (req, res) => {
    var enrollee = (currentUser(req, res));
    const { subject_name } = req.body;

    try {
        var subject = await Subject.findOne({ subject_name });

        if (subject == null) {
            res.send("There is no subject with name " + subject_name)
        } else {
            var s_id = subject._id.toString();

            //validate if user is already enrolled

            var checkEnrollment = await User.findOne(
                { email: enrollee },
                { subjects: { $elemMatch: { subject_id: s_id } } }
            );



            if (checkEnrollment.subjects.length == 0) { //add subject to user
                var user = await User.updateOne(
                    { email: enrollee },
                    { $push: { subjects: { subject_id: s_id, status: "enrolled" } } }
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

app.patch("/unenroll", auth, async (req, res) => {
    const user = currentUser(req, res);
    const { subject_name } = req.body;
    if (subject_name != null) {
        try {
            const findSubject = await Subject.findOne(
                { subject_name: subject_name }
            );
            if (findSubject != null) {

                const findUser = await User.findOneAndUpdate
                    (
                        { email: user },
                        { $pull: { subjects: { subject_id: findSubject._id.toString() } } }
                    );
                res.status(200).send("You have successfully unenrolled from: " + subject_name);
            } else {
                res.status(400).send("Subject does not exist.");
            }

        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    }

});

//function to get subjects of user
app.get("/subjects", auth, async (req, res) => {
    var enrollee = (currentUser(req, res));
    var user = await User.findOne({ email: enrollee });

    res.status(200).json(user.subjects);
});

app.patch("/subjects", auth, async (req, res) => {
    const { subject_name, s } = req.body;

    var enrollee = (currentUser(req, res));
    if (subject_name == null || s == null) {
        res.status(400).send("All fields are required");
    } else {
        try {
            var subject = await Subject.findOne({ subject_name });
            if (subject == null) {
                res.status(400).send("There is no subject with name " + subject_name);
            } else {
                var s_id = subject._id.toString();


                var checkEnrollment = await User.findOneAndUpdate(
                    { email: enrollee, subjects: { $elemMatch: { subject_id: s_id } } },
                    { $set: { 'subjects.$.status': s } }
                );

                res.status(200).send("Successfully updated " + subject_name + " to " + s);
            }


        } catch (err) {
            res.status(400).send(err);
        }
    }

});

app.delete("/delete", auth, async (req, res) => {
    const { email } = req.body;
    console.log(email)
    if (currentUser(req, res) == email) {
        try {
            const deleteUser = await User.deleteOne({ email });
            res.status(200).send("User " + email + " has been deleted.");
        } catch (err) {
            res.status(400).send(err);
        }

    } else {
        res.status(400).send("You are not authorized to delete this user");
    }
})

module.exports = app;