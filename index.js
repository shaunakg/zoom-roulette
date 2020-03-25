
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

app.get('/api/server/current_meetings', function (req, res) {

    for (i = 0; i < Object.keys(db).length; i++) {
        res.write("\n---\n<b>" + db[i].title + "</b>\nID: " + db[i].id + "\nDescription: " + db[i].description + "\nExpiry date: " + db[i].expDate);
    }

    res.end();

})

app.get('/api/submit/:cms', function (req, res) {

    console.log(req.query);

    if (req.params.cms == "zoom") {
        const mid = req.query.id;
        const mexp = req.query.expdate;
        const mtitle = req.query.title;
        const mdesc = req.query.description;
        db.push({
            id: mid,
            expDate: mexp,
            title: mtitle,
            description: mdesc
        });
    }

    console.log(db.slice(-1)[0]);

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
        res.redirect("../../../meeting/?" + querystring.stringify(returnedMeeting));
        res.end();

    }

});

// Listen for connections
http.listen(PORT, function(){
    console.log('listening on *:' + PORT);
});