const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Hello World from Express");
});
app.use("/test", (req, res) => {
  res.send("Hello Test");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
