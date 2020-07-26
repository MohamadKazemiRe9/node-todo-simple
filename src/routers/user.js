const express = require('express');
const auth = require("../middleware/authentication");
const User = require("../models/user");
const router = new express.Router();
const multer = require("multer");
const sharp = require("sharp");

router.post('/users',async (req,res)=>{
    const user = new User(req.body);
    try {
        const token = await user.generateAuthToken();
        await user.save();
        res.status(201).send({user,token});
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/users/profile',auth,async (req,res)=>{
    res.send(req.user);
});

router.get('/users', auth , async(req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send();
    }
});

router.get('/users/:id', async(req, res) => {
    try {
        const _id = req.params.id;
        const user = await User.findById(_id);
        res.status(200).send(user);
    } catch (error) {
        res.status(404).send("user not found");
    }
});


router.patch('/users/profile',auth, async(req, res) => {

    const updates = Object.keys(req.body); //brings an array with sended req.body keys like:["name","username",..]
    const allowedUpates = ['name','email','password','age'];
    const isValidUpdates = updates.every(update=>allowedUpates.includes(update));

    if(!isValidUpdates){
        res.status(400).send({error:"wrong inputs"});
    }

    try {
        // const user = await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true});
        updates.forEach((update)=>{
            req.user[update] = req.body[update];
        });
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(400).send(e.message);
    }
});

router.delete('/users/profile', auth , async(req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (error) {
        res.status(500).send();
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findUserByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user:user.getPublicProfile(),token });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/users/logout',auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((item)=>{
            return item.token !== req.token;
        });

        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});


const upload = multer({
    limits:{
        fileSize:500000 
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png)$/)){
            return cb(new Error("You must select correct format! png or jpg"));
        }
        cb(undefined,true);
    }
});


router.post('/users/profile/avatar', auth ,  upload.single("avatar") , async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:200,height:200}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send("avatar update successfuly");
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
});

router.delete('/users/profile/avatar',auth, async(req, res) => {
    if(!req.user.avatar){
        res.status(400).send({error:"You have no avatar yet!"});
    }
    req.user.avatar = undefined;
    await req.user.save();
    res.send({message:"avatar removed"})
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error();
        }
        res.set('Content-Type','image/png');
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send({error:"avatar not found!"});
    }
});

module.exports = router;