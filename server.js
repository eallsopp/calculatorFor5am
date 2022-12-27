const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!! SHUTTING DOWN...");
  console.log("err");
  console.log(err);
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

//at end of server process error, sandwiches with error handling
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled REJECTION! SHUTTING DOWN...");
  server.close(() => {
    process.exit(1);
  });
});
