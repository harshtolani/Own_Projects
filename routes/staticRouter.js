const express = require("express");
const URL = require("../models/url"); // ✅ this was missing!

const router = express.Router();

router.get("/", async (req, res) => {
    const allurls = await URL.find({}); // ✅ Now it works!
    return res.render("home", {
        urls: allurls,
    });
});


router.get("/signup", (req, res) => {
    return res.render("signup");
} );

router.get("/login", (req, res) => {
    return res.render("login");
} );


module.exports = router;
