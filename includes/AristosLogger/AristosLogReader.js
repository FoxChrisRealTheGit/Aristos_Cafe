const fs = require("fs")

//available logger object
let LogReader = exports.LogReader = {};

// function to read all the lines line by line
function readLines(input, cb) {
    let remaining = '';

    input.on('data', function (data) {
        remaining += data;
        let index = remaining.indexOf('\n');
        let last = 0;
        while (index > -1) {
            let line = remaining.substring(last, index);
            last = index + 1;
            cb(line);
            index = remaining.indexOf('\n', last);
        }

        remaining = remaining.substring(last);
    });

    input.on('end', function () {
        if (remaining.length > 0) {
            cb(remaining);
        }
    });
}

// read last line
function readLastLine(input, cb) {
    let remaining = '';

    input.on('data', function (data) {
        remaining += data;
        let index = remaining.indexOf('\n');
        let last = 0;
        while (index > -1) {
            let line = remaining.substring(last, index);
            last = index + 1;
            index = remaining.indexOf('\n', last);
            if (index === -1) {
                cb(line);
            }
        }
    });

    input.on('end', function () {

    });
}

// read the last X lines
function readManyLastLines(input, cb, num) {
    let remaining = '';

    input.on('data', function (data) {
        remaining += data;
        let index = remaining.indexOf('\n');
        let last = 0;
        let indexArr = [];
        let lastArr = [];
        while (index > -1) {
            last = index + 1;
            index = remaining.indexOf('\n', last);
            indexArr.push(index);
            lastArr.push(last);
        }
        indexArr.sort((a, b) => b - a)
        lastArr.sort((a, b) => b - a)
        for (let i = num - 1; i >= 0; i--) {
            let line = remaining.substring(lastArr[i + 1], indexArr[i])
            cb(line)
        }
    });
    input.on('end', function () {

    });
}

// read the first line
function readFirstLine(input, cb) {
    let remaining = '';

    input.on('data', function (data) {
        remaining += data;
        let index = remaining.indexOf('\n');
        let last = 0;
        while (last < 1) {
            let line = remaining.substring(last, index);
            last += 1;
            cb(line);
        }
    });
    input.on('end', function () {
    });
}
// read the first X lines
function readManyFirstLines(input, cb, num) {
    let remaining = '';

    input.on('data', function (data) {
        remaining += data;
        let index = remaining.indexOf('\n');
        let last = 0;
        let count = 0;
        while (count < num) {
            let line = remaining.substring(last, index);
            last = index + 1;
            cb(line);
            index = remaining.indexOf('\n', last);
            count += 1
        }
    });

    input.on('end', function () {

    });
}



// need a variety of functions to use the data read in different ways
// this just console logs the info
function func(data) {
    console.log('Line: ' + data);
}
// use the data in another way


// use the data in another way


// use the data in another way





// functions to read messages from the log files
// also places current date
LogReader.info = function (type, usecase) {
    let infoStream = fs.createReadStream('./includes/AristosLogger/logs/info.txt');
    switch (type) {
        case "all":
            switch (usecase) {
                case "console":
                    return readAllLines(infoStream, func)

                default:
                    return readAllLines(infoStream, func)
            }
        case "last":
            return readLastLine(infoStream, func)

        case "manyLast":
            return readManyLastLines(infoStream, func, arguments[2])

        case "first":
            return readFirstLine(infoStream, func)

        case "manyFirst":
            return readManyFirstLines(infoStream, func, arguments[2])
            break;
        default:
            return readAllLines(infoStream, func)
    }
};

LogReader.debug = function () {
    let errorStream = fs.createReadStream('./includes/AristosLogger/logs/error.txt')
    switch (type) {
        case "all":
            switch (usecase) {
                case "console":
                    return readAllLines(errorStream, func)

                default:
                    return readAllLines(errorStream, func)
            }
        case "last":
            return readLastLine(errorStream, func)

        case "manyLast":
            return readManyLastLines(errorStream, func, arguments[2])

        case "first":
            return readFirstLine(errorStream, func)

        case "manyFirst":
            return readManyFirstLines(errorStream, func, arguments[2])
            break;
        default:
            return readAllLines(errorStream, func)
    }
};

LogReader.error = function () {
    let debugStream = fs.createReadStream('./includes/AristosLogger/logs/debug.txt')
    switch (type) {
        case "all":
            switch (usecase) {
                case "console":
                    return readAllLines(debugStream, func)

                default:
                    return readAllLines(debugStream, func)
            }
        case "last":
            return readLastLine(debugStream, func)

        case "manyLast":
            return readManyLastLines(debugStream, func, arguments[2])

        case "first":
            return readFirstLine(debugStream, func)

        case "manyFirst":
            return readManyFirstLines(debugStream, func, arguments[2])
            break;
        default:
            return readAllLines(debugStream, func)
    }
};