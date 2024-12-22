// IMPORTS -
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const errorMiddleware = require("./middlewares/error");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// CONFIG -
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "./config/config.env" });
}

// FOR DEPLOYMENT -
app.get("/", (req, res) => {
  res.send("<h1>Processing</h1>");
});

// MIDDLEWARES -
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(
  cors({
    credentials: true,
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ROUTES -
const user = require("./routes/userRoute");
const pet = require("./routes/petRoute");
const apply = require("./routes/applyRoute");

// END POINTS -
app.use("/Petcare", user);
app.use("/Petcare", pet);
app.use("/Petcare", apply);

// MIDDLEWARE  FOR ERRORS -
app.use(errorMiddleware);
module.exports = app;
