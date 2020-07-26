const express = require ("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(userRouter,taskRouter);


app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});
