
var express = require('express');
var app = express();
var http = require('http').createServer(app);
const querystring = require('querystring');
var nosql = require('nosql');

const PORT = process.env.PORT || 8080;
var db = [{
    id: '123456789',
    expdate: '2025-03-24T21:37',
    title: 'Test meeting',
    description: 'This is a test meeting. The ID is not valid.'
}];

app.use(express.static('static'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/static/index.html');
});

app.get('/stylesheet.css', function(req, res){
    res.sendFile(__dirname + '/static/stylesheet.css', headers = {
        'Content-Type' : 'text/css'
    });
});

app.get('/meeting/meeting-stylesheet.css', function(req, res){
    res.sendFile(__dirname + '/static/meeting-stylesheet.css', headers = {
        'Content-Type' : 'text/css'
    });
});

app.get('/meeting/', function (req, res) {
    res.sendFile(__dirname + '/static/meeting.html');
});

app.get('/api/submit/:cms', function (req, res) {

    console.log(req.query);

    if (req.params.cms == "zoom") {
        const id = req.query.id;
        const expDate = req.query.expdate;
        const title = req.query.meetingTitle;
        const description = req.query.desc;
        db.push({
            id: id,
            expDate: expDate,
            title: title,
            description: description
        });
    }

    res.redirect("../../../?status=ok");

});

app.get('/api/deliver/:cms', function (req, res) {

    if (req.params.cms == "zoom") {

        var epochMsNow = (new Date()).getTime();
        var returnedMeeting = db[Math.floor(Math.random() * db.length)];

        while (epochMsNow > Date.parse(returnedMeeting.expDate)) {
            returnedMeeting = db[Math.floor(Math.random() * db.length)];
        }

        res.statusCode = 303;
        res.set("Location", "../../../meeting/?" + querystring.stringify(returnedMeeting));
        res.end();

    }

});

// Listen for connections
http.listen(PORT, function(){
    console.log('listening on *:' + PORT);
});