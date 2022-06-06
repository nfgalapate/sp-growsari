require("dotenv").config();


const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const bodyParser = require("body-parser");
const User = require("../model/user");

var app = express.Router();

app.post("/", async (req, res) => {


    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (email==null || password ==null) {
            res.status(400).send("All input is required");
        } else {
        
            // Validate if user exist in our database
            const user = await User.findOne({ email });

            if (user && (bcrypt.compareSync(password, user.password))) {
                // Create token
                const token = jwt.sign(
                    { user_id: user._id, email },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );

                // save user token
                user.token = token;

                // user
                res.status(200).json(user);
            } else {
                res.status(400).send("Invalid Credentials");
            }
        }
        
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

module.exports = app;