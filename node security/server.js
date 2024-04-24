const fs = require("fs");
const path = require("path");
const https = require("https");
const helmet = require("helmet");
const express = require("express");
const passport = require("passport");
const cookieSession = require("cookie-session");
const { Strategy } = require("passport-google-oauth20");

require("dotenv").config();

const PORT = 3000;

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

const AUTH_OPTIONS = {
  callbackURL: "/auth/google/callback",
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};

function verifyCallback(accessToken, refreshToken, profile, done) {
  done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

const app = express();

app.use(helmet());

app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2], //secret key
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Save the session to the cookie
passport.serializeUser((user, done) => {
  console.log(user.id, "user");
  done(null, user.id);
});

//Read the already saved session from the cookie
passport.deserializeUser((id, done) => {
  console.log(id, "id");
  done(null, id);
});

function checkedLoggedIn(req, res, next) {
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn)
    return res
      .status(401)
      .json({ status: "error", message: "You must log in" });
  next();
}

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email"], //Data we need from the google
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
    session: true,
  }),
  (req, res) => {
    console.log("Google callback");
  }
);
app.get("/failure", (req, res) => {
  return res.send("Failed to login!");
});

app.get("/auth/logout", (req, res) => {
  req.logOut();
  return res.redirect("/");
});

app.get("/secret", checkedLoggedIn, (req, res) => {
  res.send("Something encrypted");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

https
  .createServer(
    {
      cert: fs.readFileSync("cert.pem"),
      key: fs.readFileSync("key.pem"),
    },
    app
  )
  .listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
