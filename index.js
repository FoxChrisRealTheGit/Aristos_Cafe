const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const expressValidator = require("express-validator")
const path = require("path");
const fs = require("fs-extra");
const config = require("./includes/config/stuff")
const fileUpload = require("express-fileupload")
const passport = require("passport")
const Logger = require("./includes/AristosLogger/AristosLogger").Logger;

// Connect to db
mongoose.connect(config.database)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Connected to MongoDB")
})

//Init app
const app = express();

// View engine setup
app.set("views", path.join(__dirname, "content/theme/views"));
app.set("view engine", "ejs")


//Set admin css folder
app.use(express.static(path.join(__dirname, "includes/admin/admincss")))
//Set public folder
app.use(express.static(path.join(__dirname, "content/public")))


// Set global errors variable
app.locals.errors = null;

//Check for upgrades
fs.pathExists("content/upgrade/blog")
    .then(exists => {
        if (exists) {
            app.locals.blogsExists = true;
        } else {
            app.locals.blogsExists = false;
        }
    })
fs.pathExists("content/upgrade/products")
    .then(exists => {
        if (exists) {
            app.locals.productsExists = true;
        } else {
            app.locals.productsExists = false;
        }
    })
fs.pathExists("content/upgrade/project-management")
    .then(exists => {
        if (exists) {
            app.locals.projectManagementExists = true;
        } else {
            app.locals.projectManagementExists = false;
        }
    })
    fs.pathExists("content/upgrade/portfolio-projects")
    .then(exists => {
        if (exists) {
            app.locals.portfolioManagementExists = true;
        } else {
            app.locals.portfolioManagementExists = false;
        }
    })
    fs.pathExists("content/upgrade/contact")
    .then(exists => {
        if (exists) {
            app.locals.contactManagementExists = true;
        } else {
            app.locals.contactManagementExists = false;
        }
    })
// check plugins
fs.pathExists("content/plugins/printful")
    .then(exists => {
        if (exists) {
            app.locals.printfulPluginExists = true;
        } else {
            app.locals.printfulPluginExists = false;
        }
    })


// Express fileUpload middleware
app.use(fileUpload());

// Get page model
let Page = require("./includes/models/page");

// Get all pages to pass to header.ejs
Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {
    if(err){ Logger.error(err)
    } else {
        app.locals.pages = pages;
    }
})



// Body Parser Middleware
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//Parse application/json
app.use(bodyParser.json());


// Express Session middleware
app.use(session({
    secret: "keybaord cat",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
    // cookie: { secure: true }
}));

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        let namespace = param.split(".")
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += "[" + namespace.shift() + "]";
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        };
    },
    customValidators: {
        isImage: function (value, filename) {
            let extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case ".jpg":
                    return ".jpg"
                case ".jpeg":
                    return ".jpeg"
                case ".png":
                    return ".png"
                    case ".svg":
                    return ".svg"
                case "":
                    return ".jpg"
                default:
                    return false
            }
        }
    }
}));

// Express Messages middleware;
app.use(require("connect-flash")());
app.use(function (req, res, next) {
    res.locals.messages = require("express-messages")(req, res);
    next();
});

// Passport Config
require("./includes/config/passport")(passport)

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session())

app.get("*", function (req, res, next) {
    res.locals.cart = req.session.cart;
    res.locals.user = req.user || null;
    next();
})


// Set routes
require("./includes/admin")(app);


//start the server
const port = 3000;
app.listen(port, function () {
    console.log("Aristos CMS - Node - is listening on port:  " + port)
})