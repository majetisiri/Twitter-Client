var express = require('express'),
    passport          =     require('passport'),
   Twitter = require('twitter-node-client').Twitter,
    TwitterStrategy   =     require('passport-twitter').Strategy,
    session           =     require('express-session'),
    app               =     express();
   
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/images', express.static('images'));
 
var config =require('./js/config.js'); 

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new TwitterStrategy({
    consumerKey: config.twitter_api_key,
    consumerSecret:config.twitter_api_secret ,
    callbackURL: config.callback_url
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));


app.get('/', function (req, res) {
	res.sendFile(__dirname + '/views/index.html');
});

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(session({ secret: 'keyboard cat', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/auth/twitter', passport.authenticate('twitter'));


app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect : '/tweets', failureRedirect: '/login' }),
  function(req, res) {
    res.sendFile('tweets.html');
    console.log(res);
  });



app.get('/tweets', function (req, res) {
  res.sendFile(__dirname + '/views/tweets.html');
});

app.get('/account', ensureAuthenticated, function(req, res){
  var screenName=req.user.username;
  var error = function (err, response, body) {
        console.log('ERROR [%s]', err);
    };
    var success = function (data) {
        res.send(data);
    };

  var config = {
      "consumerKey": "S6E4L0pevIppwYYTIT5Y1WHhy",
      "consumerSecret": "rrEGzX20z5G6XQIV52EnpCo7AoBE1T8RNGx7Sxa2BrqTTnsvA0",
      "accessToken": "157985123-KAyJIeShzCcTxox3oTLPBs229wBJtkY2Ggg7LB34",
      "accessTokenSecret": "WNcWMbvFzO1wfmaV8jnueaIAzgq6sTTbfSYrsmejPuWuO"  
     }

  var twitter = new Twitter(config);
    twitter.getUserTimeline({ screen_name:screenName}, error, success);

});


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

app.listen(3000, function () {
  console.log('app listening on port 3000!');
});
