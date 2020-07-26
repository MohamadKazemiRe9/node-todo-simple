const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/authentication");
const router = new express.Router();

router.post('/tasks', auth , async (req, res) => {
    const creates = Object.keys(req.body);
    const allowTocreate = ["description","complated"];
    const isValid = creates.every(item=>{
        return allowTocreate.includes(item);
    })
    if(!isValid){
        return res.status(400).send("please check inputs again!");
    }
    const task = new Task({
        ...req.body,
        user:req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/tasks/:id',auth, async(req, res) => {
    try {
        const task = await Task.findOne({_id:req.params.id,user:req.user.id});
        if(!task){
            return res.status(404).send("task is not found.");
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

// router.get('/tasks', auth ,async(req, res) => {
//     try {
//         // const tasks = await Task.find({user:req.user._id}); //there is another way
//         await req.user.populate('tasks').execPopulate();
//         res.send(req.user.tasks);
//     } catch (error) {
//         res.status(500).send();
//     }
// });

// search user task by coplated or not
router.get('/tasks', auth ,async(req, res) => {
    const match = {};
    const sort = {};
    const page = (parseInt(req.query.page)-1)*parseInt(req.query.limit);
    if(req.query.complated==="true" || req.query.complated==="false"){
        match.complated = req.query.complated;
    }

    sort.createdAt = req.query.sort==="asc" ? 1 :-1
    
    try {
        // const tasks = await Task.find({user:req.user._id}); //there is another way
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit : parseInt(req.query.limit),
                skip : page,
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (error) {
        res.status(500).send();
    }
});

router.patch('/tasks/:id', auth ,async(req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const updatesValidate = ["description","complated"];
    const isUpdateValidation = updates.every((update)=>updatesValidate.includes(update));

    if(!isUpdateValidation){
        return res.status(400).send({error:"please check inputs!"});
    }

    try {
        const task = await Task.findOne({_id,user:req.user._id})
        updates.forEach(update=>task[update]=req.body[update]);
        await task.save();
        res.send(task);
    } catch (error) {
        res.status(400).end(error.message);
    }
});

router.delete('/tasks/:id', auth ,async(req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id,user:req.user._id});
        if(!task){
            res.status(404).send("task not found!");
        }
        await task.remove();
        res.send(task)
    } catch (error) {
        res.status(500).send();
    }
});


module.exports = router;