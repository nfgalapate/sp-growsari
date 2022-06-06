const jwt = require("jsonwebtoken");

const config = process.env;


var returnToken = (req, res) => {
    
  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    
    return(decoded.email);
    //req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

};

module.exports = returnToken;