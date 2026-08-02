const mongoose = require("mongoose");
const dns = require("dns"); //nodes native dns server(ip)

dns.setServers([
    "1.1.1.1",//cloud fare
    "1.0.0.1"
])

const connect_DB = async() =>{
    try {
        console.log(process.env.DATABASE_URI);
        const con = await mongoose.connect(`${process.env.DATABASE_URI}`);
        console.log(`connection successful to host : ${con.connection.host}`);
        
    } catch (error) {
        console.log("database connection error",error);
        throw error;
    }
}

module.exports = connect_DB;