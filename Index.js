const express = require("express");
const { connectToMongoDB } = require("./connect");
const path = require('path');
const cookieParser = require('cookie-parser'); 
const {restrictToLoggedinUserOnly} = require('./middleware/auth');
const URL = require("./models/url");
const urlRoute = require("./routes/url");
const staticRoute=require("./routes/staticRouter");
const userRoute = require('./routes/user');


const app = express();
const PORT = 8001;

app.set("view engine", "ejs"); 
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("MONGODB CONNECTED")
);




app.use("/url",restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);


app.use("/", staticRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  console.log("Requested shortId:", shortId); // debug

  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );



  console.log("DB Entry:", entry); // debug

  // 🔥 THIS IS THE LINE THAT FIXES THE ERROR
  if (!entry) {
    return res.status(404).send("<h1>Short URL not found</h1>");
  }

  res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => console.log(`server started at port ${PORT}`));
