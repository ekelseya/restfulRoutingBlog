const express = require("express");
const app = express();

const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");

// require('dotenv').config();

const User = require("./models/user.js");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

app.use(require("express-session")(({
    secret: "In truth, the only ship there is is the ship we are all on burning the world as we go",
    resave: false,
    saveUninitialized: false
})));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("We did it!");
});