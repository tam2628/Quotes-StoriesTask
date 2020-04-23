const express = require('express');
const fs = require('fs');
const {google} = require('googleapis');
const hbs = require('express-handlebars');
const {getUserAsPromise} = require('./utils/user_info');
const cookie_parser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET ||"secret";
const event_api_routes = require('./routers/events_api_routers');
const {isAuthenticated, isNotAuthenticated} = require('./middlewares/authentication_check_middlewares');
const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/calendar.events'
];

const google_credentials = JSON.parse(fs.readFileSync('google-credentials.json', 'utf-8'));

const {client_secret, client_id, redirect_uris} = google_credentials.web;

const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
    
const app = express();

//app settings
app.use(cookie_parser());
app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(express.json());

app.get('/', isAuthenticated, function (req, res) {
    // Obtain the google login link to which we'll send our users to give us access
    const login_link = oAuth2Client.generateAuthUrl({
      access_type: 'offline', // Indicates that we need to be able to access data continously without the user constantly giving us consent
      scope: SCOPES 
    });
    return res.render('home', { login_link });
});


app.get('/callback', function(req, res) {
    if(req.query.error)
        return res.redirect('/'); // The user didn't give us permission

    else{
        oAuth2Client.getToken(req.query.code, function(err, token) {
            if(err) return res.redirect('/');

            // Store the credentials given by google into a jsonwebtoken in a cookie called 'jwt'
            res.cookie('jwt', jwt.sign(token, jwt_secret), { expiry: token.expiry_date });
            return res.redirect('/dashboard');
        });
    }
});

app.get('/dashboard', isNotAuthenticated, function(req, res){    
    const TOKEN = jwt.verify(req.cookies.jwt, jwt_secret);
    const ACCESS_TOKEN = TOKEN.access_token;
    const user = getUserAsPromise(ACCESS_TOKEN);

    user
    .then(res => res.json())
    .then(user => {
        // If the token has expired or the user hasn't provided the permission
        if(user.error !== undefined){
            res.clearCookie('jwt');
            return res.redirect("/");
        }

        let {email, name, picture} = user;      
        return res.render("dashboard", { email, name, picture });
    })
    .catch(err => console.log(err));
})

app.get('/events/create', function(req, res){
    res.render('create_events');
});

// routes to the api which gets and create the events
app.use('/api/events', event_api_routes);

app.get('*', function(req, res){
    res.render("404");
});

app.listen(process.env.PORT || 8080);