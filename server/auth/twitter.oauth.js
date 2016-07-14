'use strict';

var passport = require('passport');
var TwitterStrategy = require('passport-twitter-oauth').OAuth2Strategy;
var User = require('../api/users/user.model');

module.exports = new TwitterStrategy({
  clientID: 'SmjwX1zFEpJ3lh5jkY6qh1Clc',
  clientSecret: '9mn2dGm4xYD1ss5j9vCFZ65oBdiHLUIm2FxZj4mE6f2gXSbZSg',
  callbackURL: '/auth/twitter/callback'
}, function (token, refreshToken,  profile, triggerSerializationOfUser) {
  // this only runs when somebody logs in through google
  User.findOrCreate({
    where: {twitterId: profile.id},
    defaults: {
      email: profile.emails[0].value,
      name: profile.displayName,
      photo: profile.photos[0].value
    }
  })
  .spread(function (user) {
    triggerSerializationOfUser(null, user);
  })
  .catch(triggerSerializationOfUser);
});
