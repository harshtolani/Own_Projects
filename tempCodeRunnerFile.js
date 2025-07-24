const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const app = express();
const PORT = 8001;

app.use(express.json());

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("MONGODB CONNECTED")
);

app.get("/test", async (req, res) => {
  const allUrls = await URL.find({});
  return res.end(`
        <html>
        <head></head>
        <ol>
        ${allUrls
          .map(
            (url) =>
              `<li> ${url.shortId} - ${url.redirectUrl} - ${url.visitHistory.length}</li>`
          )
          .join("")}
        </ol>
        </html>
        `);
});

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  if (!entry) {
    return res.status(404).send("<h1>Short URL not found</h1>");
  }

  res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => console.log(`server started at port ${PORT}`));
