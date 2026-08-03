require("dotenv").config();
const app = require("./app.js");
const DB_connection = require("./src/db/connection.js");
const port = process.env.PORT;

(async () => {
  try {
    await DB_connection();
    const server = app.listen(port, () => {
      console.log(`server is running on the port: ${port}`);
    });

    server.on("Error", (error) => {
      console.error("server error: ", error);
    });
  } catch (error) {
    console.log("server startup error", error);
    process.exit(1);
  }
})();

//prabinbhusal761_db_user
//BROsF8bw9kkhUi4t

// DB_connection()
//   .then(() => {
//     app.on("error", (error) => {
//       console.log("server startup Error", error);
//       throw error;
//     });
//   })
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`server is running on port ${port}`);
//     });
//   })
//   .catch((error) => {
//     console.log("database connection failure", error);
//   });
