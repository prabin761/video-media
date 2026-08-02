require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app.js");
const DB_connection = require("./src/db/connection.js");
const port = process.env.PORT;




(async() => {
    try {
      await DB_connection(); 
       app.listen(port,()=>{
        console.log(`server is running on the port: ${port}`);
       })
    } catch (error) {
        console.log("server startup error",error);
        process.exit(1);
    }
})()

//prabinbhusal761_db_user
//BROsF8bw9kkhUi4t