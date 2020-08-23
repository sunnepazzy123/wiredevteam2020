const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");
const dotenv = require("dotenv");
const Handlebars = require("handlebars");
const {allowInsecurePrototypeAccess} = require("@handlebars/allow-prototype-access");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const methodOverride = require("method-override");
const flash = require("connect-flash");

const passport = require("passport");
// const Lo = require("passport-local").Strategy;



//Load config file
dotenv.config({path: "./config/config.env"});

const {mongoDbUrl} = require("./config/database");



mongoose.Promise = global.Promise;

mongoose.connect(mongoDbUrl, {useUnifiedTopology: true, useNewUrlParser: true }).then((db)=>{
    console.log("MONGO CONNECTED");
}).catch(error=> console.log("COULD NOT CONNECT => " + error));




app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/admin")));


const {select, generateDate, smartText, paginate, html_text, stripTags, truncate} = require('./helpers/handlebars-helpers');


// //SET TEMPLATE ENGINE
app.engine("handlebars", exphbs({defaultLayout: "home", handlebars: allowInsecurePrototypeAccess(Handlebars), helpers: {select: select, smartText: smartText, html_text: html_text, stripTags: stripTags, truncate, generateDate: generateDate, paginate: paginate}} ));
app.set("view engine", "handlebars");

app.use(fileUpload());
// Method Override

app.use(methodOverride('_method'));
app.use(session({
    secret: "wiredevteam@wdt.com",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})

}));

app.use(flash());
//PASSPORT 
app.use(passport.initialize());
app.use(passport.session());


//LOCAL VARIABLES USING MIDDLEWARES
app.use((req,res,next)=>{

res.locals.user = req.user || null;
res.locals.error = req.flash('error');
res.locals.error_message = req.flash('error_message');

res.locals.success_message = req.flash("success_message");
res.locals.delete_message = req.flash("delete_message");

    next();



});

// //BODY PARSER
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// LOAD ROUTES
const home = require("./routes/home/main");
const comments = require("./routes/admin/comments");
const admin = require("./routes/admin/index");
const posts = require("./routes/admin/posts");
const categories = require("./routes/admin/categories");







//USE ROUTES
app.use("/", home);
app.use("/admin", admin);
app.use("/admin/posts", posts);
app.use("/admin/categories", categories);
app.use("/admin/comments", comments);


const PORT = 48000


app.listen(PORT, ()=>{

    console.log(`server connected to ${PORT} `);
});

