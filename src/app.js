const express = require("express");
const cors = require("cors");

const memberRoutes = require("./routes/member.routes");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("src/uploads"));

app.use("/api/members", memberRoutes);

app.get("/", (req, res) => {
  res.send("Siragugal API Running...");
});

module.exports = app;
