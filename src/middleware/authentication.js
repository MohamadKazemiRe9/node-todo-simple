const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req,res,next)=>{
    try {
        const token = req.header("Authorization").replace("Token ","");
        const decoded = jwt.verify(token,'dota2isgoodgame');
        const user = await User.findOne({_id:decoded._id , 'tokens.token':token});
        if(!user){
            throw new Error("You have no access no more! Please try to login.")
        }
        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(401).send("please authenticate first!");
    }
}

module.exports = auth;