const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");
const { Binary } = require("mongodb");



const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
        trim:true
    },
    email :{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
             if(!validator.isEmail(value)){
                 throw new Error("Email address is invalid!");
             }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error("you cant have have password include 'password'!!!")
            }
        }
    },  
    age : {
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error("age can't be negative value!")
            }
        }
    },
    avatar : {
        type:Buffer
    },
    tokens : [{
        token : {
            type:String,
            require:true
        }
    }]
}, {
    timestamps : true
});


// refresnce to another model in virtual mode
userSchema.virtual('tasks',{
    ref:Task,
    localField:"_id",
    foreignField:"user"
});

// show when login whitout shoing password and tokens when add getPublicProfile function to it!
userSchema.methods.getPublicProfile = function(){
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;


    return userObject
}

// use in profile without showing tokens ***no need to call this***
userSchema.methods.toJSON = function (){
    const user = this;
    const userObject = user.toObject();
    
    delete userObject.tokens;
    delete userObject.avatar;
    delete userObject.password;

    return userObject;
}

// generate token
userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({ _id:user._id },'dota2isgoodgame');

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}


// login
userSchema.statics.findUserByCredentials = async (email,password)=>{
    const user = await User.findOne({email});
    if(!user){
        throw new Error("this email is not signin yet!");
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error("email or password is incorrect!");
    }
    return user
}

// hash password before save password
userSchema.pre('save',async function (next){
    const user = this;
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }
    next()
});

// delete task when a user remove
userSchema.pre('remove',async function(next){
    const user = this;
    await Task.deleteMany({user:user._id});
    next()
});


const User = mongoose.model("User",userSchema);
module.exports = User;