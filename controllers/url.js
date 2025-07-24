const { nanoid } = require("nanoid");
const URL = require("../models/url");

const handlegenerateNewShortURL = async (req, res) => {
  const body = req.body;

  if (!body.url) {
    return res.status(400).json({ error: "url is required" });
  }

  const shortId = nanoid(8); // generates a unique short ID

  try {
    await URL.create({
      shortId: shortId,
      redirectUrl: body.url,
      visitHistory: [],
    });
    return res.render('home',{
      id: shortId,
    });
   
   
  } catch (err) {
    console.error("Error saving to MongoDB:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


async function handleGetAnalytics (req,res) {
   const shortId = req.params.shortId;
   const result = await URL.findOne({shortId});
   return res.json({totalClicks:result.visitHistory.length, analytics:result.visitHistory});
}

module.exports = {
  handlegenerateNewShortURL,
  handleGetAnalytics,
};

