'use strict';

var router = require('express').Router();

var User = require('../api/users/user.model');
var crypto = require('crypto');
var ssecret = require('../../oauth.js')

router.post('/signup', function (req, res, next) {
  // process info from request and validate then create a user (in db)
  // "log them in"

  const secret = ssecret.secret;
  const hash = crypto.createHmac('sha256', secret)
                   .update(req.body.password)
                   .digest('hex');
  req.body.password = hash;

  User.create(req.body)
  .then(function (user) {
    req.login(user, function (err) {
      if (err) next(err);
      else res.json(user);
    });
    res.json(user);
  })
  .catch(next);
});

router.post('/login', function (req, res, next) {

  const secret = ssecret.secret;
  const hash = crypto.createHmac('sha256', secret)
                   .update(req.body.password)
                   .digest('hex');
  req.body.password = hash;

  User.findOne({where: req.body})
  .then(function (user) {
    if (user) {
      // triggers serialization (via passport)
      req.login(user, function (err) {
        if (err) next(err);
        else res.json(user);
      });
    } else {
      res.sendStatus(401);
    }
  })
  .catch(next);
});

router.get('/me', function (req, res, next) {
  res.json(req.user);
});

router.get('/logout', function (req, res, next) {
  // req.session.destroy(); // works, but this is extreme
  req.logout();
  res.sendStatus(204);
});

router.use(require('./oauth.router'));

module.exports = router;
