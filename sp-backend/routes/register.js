require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const bodyParser = require("body-parser");
const User = require("../model/user");

var app = express.Router();

app.use(bodyParser.json());

app.post("/", async (req, res) => {

    try {

        // Get user input
        const { first_name, last_name, email, password } = req.body;
        var encryptedPassword;
        // Validate user input
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required");
        } else {
            // check if user already exist
            // Validate if user exist in our database
            const oldUser = await User.findOne({ email });

            if (oldUser) {
                return res.status(409).send("User Already Exist. Please Login");
            }

            //Encrypt user password
            const saltRounds = 10;
            const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
            //save user to db
            const user = User.create({
                first_name,
                last_name,
                email: email.toLowerCase(), // sanitize: convert email to lowercase
                password: hashedPwd,
            });


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

            // return new user
            res.status(201).json(user);
        }


    } catch (err) {
        console.log(err);
    }
});

module.exports = app
