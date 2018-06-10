const fs =require("fs-extra")

// available logger object
// const Logger = require("path to logger").Logger;
let Logger = exports.Logger = {};

/*
*
* after require import
* use like this:
* Logger.info("Stuffs here.")
* Logger.error(err)
* Logger.debug(shouldThisHappen???) <- maybe not like this
*
*/

// create log directory and nessesary files
// keep these in the .gitignore so they are not pushed
fs.ensureDirSync("./includes/AristosLogger/logs")
fs.ensureFileSync("./includes/AristosLogger/logs/debug.txt")
fs.ensureFileSync("./includes/AristosLogger/logs/error.txt")
fs.ensureFileSync("./includes/AristosLogger/logs/info.txt")

// Logger write streams
// info stream with append flag
let infoStream = fs.createWriteStream('./includes/AristosLogger/logs/info.txt', {"flags": "a"});

// error stream with append flag
let errorStream = fs.createWriteStream('./includes/AristosLogger/logs/error.txt', {"flags": "a"});

// debug stream with append flag
let debugStream = fs.createWriteStream('./includes/AristosLogger/logs/debug.txt', {"flags": "a"});



// functions to write messages to the log files
// also places current date

/* use for admin logs and basic info */
Logger.info = function(stuffs) {
    let log = new Date().toString() + " : " + stuffs + "\n";
    infoStream.write(log);
  };
  
  /* use for debugging new implementation */
  Logger.debug = function(stuffs) {
    let log = new Date().toString() + " : " + stuffs + "\n";
    debugStream.write(log);
  };
  
  /* use for error logging */
  Logger.error = function(stuffs) {
    let log = new Date().toString() + " : " + stuffs + "\n";
    errorStream.write(log);
  };