var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

var users = [];

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'herhangi bir key'}));

app.use(function(req, res, next) {
	console.log(req.url);
	next();
});

app.use('/users', function(req, res, next) {
	// kullanıcı giriş yapmamış olsun
	console.log('kullanıcı giriş yapmadı');
	res.redirect('/login');
});

app.get('/', function(req, res) {
	//res.send('ana sayfa');
	res.render('index', {
		title: 'ana sayfa'
	});
});

app.get('/login', function(req, res) {
	//res.send('giriş sayfası');
	res.render('login', {
		title: 'giriş sayfası'
	});
});

app.post('/login', function(req, res) {
	for(var i=0; i<users.length; i++) {
		var user = users[i];
		if(user.email == req.body.email && user.password == req.body.password) {
			req.session.user = user;
			return res.redirect('/');
		}
	}
	return res.redirect('/login');
});

app.get('/register', function(req, res, next) {
	// uygulama çalışırken bir hata oluştuğunu varsayıyoruz
	//return next('çok kötü bir hata');
	//res.send('kullanıcı kayıt');
	res.render('register', {
		title: 'kullanıcı kayıt'
	});
});

app.post('/register', function(req, res) {
	var user = {
		userid: users.length,
		email: req.body.email,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		password: req.body.password
	};
	users.push(user);
	res.redirect('/');
});

app.get('/users', function(req, res) {
	res.send('kullanıcı listesi');
});

app.get('/users/:userid', function(req, res) {
	res.send(req.params.userid+' numaralı kullanıcı');
});

app.get('/error', function(req, res) {
	res.send('bir hata oluştu. lüthen tekrar deneyiniz');
});

app.use(function(err, req, res, next) {
	console.log(err);
	res.redirect('/error');
});

app.listen(3000, function() {
	console.log('uygulama çalışıyor');
});
