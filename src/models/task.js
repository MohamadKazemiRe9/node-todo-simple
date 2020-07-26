const mongoose = require("mongoose");


const taskSchema = new mongoose.Schema(
    {
        description : {
            type:String,
            required:true,
            validate(value){
                if(typeof(value)!==typeof("")){
                    throw new Error("please enter correct task description!")
                }
            }
        },
        complated : {
            type:Boolean,
            default:false
        },
        user : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref:"User"
        }
    } , {
        timestamps:true
    }
);

const Tasks = mongoose.model("Tasks",taskSchema);

module.exports = Tasks;