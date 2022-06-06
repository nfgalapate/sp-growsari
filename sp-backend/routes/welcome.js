
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
//const axios = require("axios").create({baseUrl: "http://dog-api.kinduff.com/api/facts"});
const axios = require("axios");
const currentUser = require("../middleware/currentuser");

router.get("/", auth, async (req, res) => {
    const response = await axios({
        url: "http://dog-api.kinduff.com/api/facts",
        method: "get"
    });
    res.status(200).send("Welcome " + currentUser(req,res) + "!" + "\n Here is a random dog fact for you: \n " + response.data.facts[0]);
});

module.exports = router;