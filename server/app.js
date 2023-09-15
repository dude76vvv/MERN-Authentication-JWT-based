require("dotenv").config();

//cross orgin with frotend react
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const port = process.env.PORT || 8080;
const mongoose = require("mongoose");

const userRoute = require("./routes/auth");
const forgetPwdRoute = require("./routes/passwordReset");
const googelOauthRoute = require("./routes/googelOauth");
const reactGoogleOauthRoute = require("./routes/reactGoogelOauth");
const session = require("express-session");
const passport = require("passport");

//needed to apply straget when googlwe authntication is applied
require("./middleware/passport");

app.use(
  cors({
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    origin: ["http://localhost:3000"],
  })
);

//for post request body
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //false to parse object as string

//setup base route
app.use("/api/v1/users", userRoute);
app.use("/api/v1/reset", forgetPwdRoute);
app.use("/api/v1/oauth", googelOauthRoute);
app.use("/api/v1/reactoauth", reactGoogleOauthRoute);

app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["abc"],
//     maxAge: 24 * 60 * 60 * 100,
//   })
// );

//access, read,write,create cookie

//neeeded for passport google-auth-2.0 initilization
app.use(passport.initialize());
app.use(passport.session());

//test
app.get("/", (req, res) => {
  res.send("Mern-Auth project server");
});

//connect to db before listening for requests
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database");

    app.listen(port, console.log(`Listening on port ${port}...`));
  })
  .catch((err) => {
    console.log("Error!!! Database and server not connected");
    console.log(err);
  });
