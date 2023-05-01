// Load Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

const {Worker,isMainThread,parentPort,workerData} = require("worker_threads");

function requireHTTPS(req, res, next) {
	// Check if acess on localhost, if so allow any connection for development.
	if (!(req.headers.host.indexOf('localhost') > -1 || req.secure)) {
		// If Heroku force https for security.
		if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
			return res.redirect('https://' + req.get('host') + req.url);
		}
	}

	next();
}

app.use(requireHTTPS);

app.set('port', process.env.PORT || 5000);
app.use('/public', express.static(__dirname + '/public'));

// Routing Pages.
app.get('/', function (request, response) {
	response.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/documentation', function (request, response) {
	response.sendFile(path.join(__dirname, '/public/documentation.html'));
});

app.get('/experimentcb', function (request, response) {
	response.sendFile(path.join(__dirname, '/public/experimentcb.html'));
});

app.get('/experimentjs', function (request, response) {
	response.sendFile(path.join(__dirname, '/public/experimentjs.html'));
});

app.get('/pif', function (request, response) {
	response.sendFile(path.join(__dirname, '/public/participantinfosheet.html'));
});

app.get('/consentform', function (request, response) {
	response.sendFile(path.join(__dirname, '/public/consentform.html'));
});

app.get('/startexperiment', function (request, response) {
	response.sendFile(path.join(__dirname, '/public/startexperiment.html'));
});

app.get('/learningcb', function (request, response) {
	response.sendFile(path.join(__dirname, '/public/learningcb.html'));
});

app.get('/learningjs', function (request, response) {
	response.sendFile(path.join(__dirname, '/public/learningjs.html'));
});

app.get('/finishexperiment', function (request, response) {
	response.sendFile(path.join(__dirname, '/public/finishexperiment.html'));
});

app.get('/done', function (request, response) {
	response.sendFile(path.join(__dirname, '/public/done.html'));
});

app.get('/experimenta', function (request, response) {
	response.sendFile(path.join(__dirname, '/public/experimentcb.html'));
});

app.get('/experimentb', function (request, response) {
	response.sendFile(path.join(__dirname, '/public/experimentjs.html'));
});

app.get('/learninga', function (request, response) {
	response.sendFile(path.join(__dirname, '/public/learningcb.html'));
});

app.get('/learningb', function (request, response) {
	response.sendFile(path.join(__dirname, '/public/learningjs.html'));
});


// Starts the server.
server.listen(process.env.PORT || 5000, function () {
	console.log('Starting server on port 5000');
});


// Connect to DB.
var mysql = require('mysql');
var con = mysql.createConnection({
	host: "REMOVED FOR PUBLIC VERSION",
	user: "REMOVED FOR PUBLIC VERSION",
	password: "REMOVED FOR PUBLIC VERSION",
	database: "REMOVED FOR PUBLIC VERSION"
});
con.connect(function (err) {
	if (err) throw err;
	console.log("Connected to DB!");
});


// Add the WebSocket handlers
io.on('connection', function (socket) {
	socket.on('runcode', function (code) {
		// Start worker and run code.
		const worker = new Worker("./private/run.js", { workerData: { code, socketid: socket.id } });
		worker.on("message", msg => { console.log(msg); io.to(msg.socketid).emit('consoleoutput', msg.message) })
	});

	socket.on('input', function (code) {
		// Send console output.
		io.to(socket.id).emit('addtoconsole', code);
	});

	socket.on('getDocumentation', function () {
		docs = require('./private/documentation/documentation.js');
		io.to(socket.id).emit('sendDocumentation', docs);
		return
	});

	socket.on('saveExperiment', function (userid, cbexperiment, jsexperiment, questions) {
		// Prepare SQL statement using ? instead of values to prevent SQL injection
		sql = `INSERT INTO Experiment(userid,cbq1answer,cbq2answer,cbq3answer,cbq4answer,cbq5answer,cbq6answer,cbq1time,cbq2time,cbq3time,cbq4time,cbq5time,cbq6time,cbq1typedchars,cbq2typedchars,cbq3typedchars,cbq4typedchars,cbq5typedchars,cbq6typedchars,cb1helpcounter,cb2helpcounter,cb3helpcounter,cb4helpcounter,cb5helpcounter,cb6helpcounter,jsq1answer,jsq2answer,jsq3answer,jsq4answer,jsq5answer,jsq6answer,jsq1time,jsq2time,jsq3time,jsq4time,jsq5time,jsq6time,jsq1typedchars,jsq2typedchars,jsq3typedchars,jsq4typedchars,jsq5typedchars,jsq6typedchars,js1helpcounter,js2helpcounter,js3helpcounter,js4helpcounter,js5helpcounter,js6helpcounter,question1,question2,question3,question4,question5) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?); `;
		con.query(sql, [userid, cbexperiment[0][0], cbexperiment[0][1], cbexperiment[0][2], cbexperiment[0][3], cbexperiment[0][4], cbexperiment[0][5], cbexperiment[1][0], cbexperiment[1][1], cbexperiment[1][2], cbexperiment[1][3], cbexperiment[1][4], cbexperiment[1][5], cbexperiment[2][0], cbexperiment[2][1], cbexperiment[2][2], cbexperiment[2][3], cbexperiment[2][4], cbexperiment[2][5], cbexperiment[3][0], cbexperiment[3][1], cbexperiment[3][2], cbexperiment[3][3], cbexperiment[3][4], cbexperiment[3][5], jsexperiment[0][0], jsexperiment[0][1], jsexperiment[0][2], jsexperiment[0][3], jsexperiment[0][4], jsexperiment[0][5], jsexperiment[1][0], jsexperiment[1][1], jsexperiment[1][2], jsexperiment[1][3], jsexperiment[1][4], jsexperiment[1][5], jsexperiment[2][0], jsexperiment[2][1], jsexperiment[2][2], jsexperiment[2][3], jsexperiment[2][4], jsexperiment[2][5], jsexperiment[3][0], jsexperiment[3][1], jsexperiment[3][2], jsexperiment[3][3], jsexperiment[3][4], jsexperiment[3][5], questions[0], questions[1], questions[2], questions[3], questions[4]], function (err, result) {
			if (err) throw err;
		});
		io.to(socket.id).emit('experimentSavedSuccessfully');

	});

	socket.on('askstartingexperiment', function () {
		// Check last entry to db id and see if odd or even
		sql = "SELECT `id` FROM `s44t9op95ak5cf9o`.`Experiment`";

		con.query(sql, function (err, result) {
			if (err) throw err;
			io.to(socket.id).emit('replystartingexperiment', result.length % 2);
		});

	});

	socket.on('translationrequest', function (code, language) {
		// Get translation file data
		languages = require('./private/translation/translation.js');

		var translation = null;

		switch (language) {
			case 'pt':
				translation = languages.pt;
				break;
			case 'fr':
				translation = languages.fr;
				break;
			case 'es':
				translation = languages.es;
				break;
			case 'it':
				translation = languages.it;
				break;
			case 'de':
				translation = languages.de;
				break;
			case 'ro':
				translation = languages.ro;
				break;
			default:
				break;
		}


		// Create regular expression
		rx = "";
		for (i in translation) {
			rx += "(^|\\W)(" + i + ")(\\W|$)" + "|";
		}
		rx = rx.slice(0, -1); // Remove last "|" as its not needed
		re = RegExp(rx, "mg");

		code = code.replace(re, function (matched) {

			matchedcopy = matched;
			matchedclean = matched.trim();
			matchedclean = matchedclean.replace('(', '');
			matchedclean = matchedclean.replace(')', '');
			matchedclean = matchedclean.replace('[', '');
			matchedclean = matchedclean.replace(']', '');
			matchedclean = matchedclean.replace('{', '');
			matchedclean = matchedclean.replace('}', '');
			matchedclean = matchedclean.replace(';', '');

			matched = matched.replace(matchedclean, translation[matchedclean]);
			return matched;
		});

		// Done send back translated code
		io.to(socket.id).emit('translationanswer', code);

	});

	socket.on('getlanguages', function () {
		languages = require('./private/translation/translation.js');
		languages2 = languages;
		io.to(socket.id).emit('sendlanguages', languages2);
	});

});


