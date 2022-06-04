const express = require("express");
const {body, validationResult} = require('express-validator');
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const Note = require("../model/note");
const currentUser = require("../middleware/currentuser");
const auth = require("../middleware/auth");
const dayjs = require('dayjs');

var app = express.Router();
app.use(bodyParser.json());

app.get("/", auth, async (req, res) => {
    try {
        var a = currentUser(req,res);
        const allNotes = await Note.find(
            {author: a}
        );
        res.status(200).json(allNotes);
    } catch (err) {
        console.log(err);
    }
});
//functionality to add notes 
app.post("/add", auth, async (req, res) => {
    
    try {
        const { note_title, content } = req.body;

        if (note_title != null && content != null) { //checks if note title and content have values
            var checkNote = await Note.findOne({note_title});
            
            if (checkNote == null){ //checks if there is no existing note with chosen title
                var author = currentUser(req,res);
                var date = dayjs().format();
                
                const note = await Note.create({
                    note_title,
                    author,
                    content,
                    date
                });
                res.status(200).send("Note is added to DB");

            } else {
                res.status(400).send("Note title is already in use.");
            }
        } else {
            res.status(400).send("Note title and content is required.");
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }

});

app.patch("/update", auth, async(req, res) =>{
    var user = currentUser(req,res);
    const {note_title, content} = req.body;
    if(note_title != null && content != null){
        try{
            const findNote = await Note.findOne({note_title});
            console.log(findNote);
            if(findNote!=null){
                var updateNote = await Note.findOneAndUpdate(
                    {note_title},
                    {$set: {content: content}}
                );
                res.status(200).send("You have successfully updated " + note_title)
            } else {
                res.status(400).send("There is no note entitled " + note_title);
            }
        } catch (err){
            console.log(err);
            res.status(400).send(err);
        }
    } else {
        res.status(400).send("Note title and content is required.")
    }
})

app.delete("/delete", auth, async(req, res) => {
    var user = currentUser(req,res);
    const {note_title} = req.body;
    if(note_title != null){
        try{
            const findNote = await Note.findOne({note_title});
            if(findNote==null){
                res.status(400).send("There is no note entitled " + note_title);
            } else {
                if (findNote.author == user){ //checks whether the user is the author
                    const deleteNote = await Note.deleteOne({note_title});
                    res.status(200).send("You have successfully deleted " + note_title);
                } else {
                    res.status(400).send("You are not authorized to delete this note.");
                }
            }
        } catch(err){
            console.log(err);
            res.status(400).send(err);
        }
        
    } else {
        res.status(400).send("Please provide the note title you wish to delete.");
    }
});

module.exports = app;