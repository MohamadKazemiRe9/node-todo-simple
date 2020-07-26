const { MongoClient , ObjectID } = require("mongodb");

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager' //databse name

// const id = new ObjectID();
// console.log(id);

MongoClient.connect(connectionURL,{ useUnifiedTopology: true },(error,client)=>{
    if(error){
        return console.log("can't connect to databse");
    }
    const db = client.db(databaseName);

    db.collection('tasks').deleteOne({
            description:"description of task 2"
        }).then((result)=>{
            console.log("delete was successful!!!"+result.deletedCount);
        }).catch((error)=>{
            console.log("error happens!");
        });



    // db.collection("tasks").updateMany({complate:true},{$set:{
    //     complate:false
    // }}).then((result)=>{
    //     console.log(`${result.modifiedCount} item has updated!`);
    // }).catch((error)=>{
    //     console.log("an error ocurred!")
    // })

    // db.collection('users').updateOne({_id:new ObjectID("5f183d1563ebd429b0ecb3d1")},{
    //     $inc:{
    //         age:-1
    //     }
    // }).then((result)=>{
    //     console.log("user updated");
    // }).catch((error)=>{
    //     console.log(error);
    // });

    // updatePromise.then((result)=>{
    //     console.log(result);
    // }).catch((error)=>{
    //     console.log(error);
    // });


    
    // db.collection('users').findOne({name:'John'},(error,user)=>{
    //     if(error){
    //         return console.log(`can't find user`)
    //     }
    //     console.log(user);
    // });

    // db.collection('tasks').find({complate:false}).toArray((error,tasks)=>{
    //     if(error){
    //         console.log("can't find tasks!");
    //     }
    //     tasks.map(task => {
    //         return console.log(task.description);
    //     })
    // })

    // db.collection('tasks').findOne({_id:new ObjectID("5f183ee21673561b9831e21f")},(error,result)=>{
    //     if(error){
    //         return console.log("can't find task with this id!");
    //     }
    //     console.log(result)
    // })

    // db.collection('tasks').find({complate:false}).count((error,count)=>{
    //     if(error){
    //         console.log("can't find tasks!");
    //     }
    //     console.log(count)
    // })

    // db.collection('users').insertOne({
    //     name:"mohammad",
    //     age:27
    // },(error,result)=>{
    //     if(error){
    //         return console.log("unable to insert user");
    //     }
    //     console.log(result.ops);
    // });

    // db.collection('users').insertMany([
    //     {
    //         name:"John",
    //         age:33
    //     },
    //     {
    //         name:`Victor`,
    //         age:28
    //     }
    // ],(error,result)=>{
    //     if(error){
    //         return console.log("can't insert to database")
    //     }
    //     console.log(result.ops)
    // });

    // db.collection('tasks').insertMany([
    //     {
    //         description:"description of task 1",
    //         complate:false
    //     },
    //     {
    //         description:"description of task 2",
    //         complate:true
    //     },
    //     {
    //         description:"description of task 3",
    //         complate:false
    //     },
    // ],(error,result)=>{
    //     if(error){
    //         return console.log("can't insert to database");
    //     }
    //     console.log(result.ops);
    // });
});