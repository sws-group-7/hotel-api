'use strict';

var router = require('../components/router');
var jsonld = require('../components/jsonld_factory');
var handler = require('../components/handler');

var config = require('../../config');

function Reviews() {
  var dbc = require('../components/db_client')('reviews');
  var reviews = router(dbc);

  reviews.get('/:id', (req, res, next) => {
    var entry = dbc.find(req.params.id);

    if (entry) {
      var json = jsonld.createResource(req.originalUrl, 'Review');
      json['date'] = entry.date;
      json['rating'] = entry.rating;
      json['comment'] = entry.comment;
      json['user'] = entry.user;
      json['hotel'] = entry.hotel;

      res.send(json);
    } else {
      res.sendStatus(404);
    }
    next();
  });

  reviews.post('/', (req, res, next) => {
    handler.createReview(req.body, (entity) => {
      if (entity) res.sendStatus(201);
      else res.sendStatus(500);

      next();
    });
  });

  reviews.put('/:id', (req, res, next) => {
    req.body['id'] = req.params.id;
    req.body.user = config.ns + '/users/' + req.body.user;
    req.body.hotel = config.ns + '/hotels/' + req.body.hotel;

    dbc.update(req.body, (entity) => {
      if (entity) res.sendStatus(200);
      else res.sendStatus(500);
    });

    next();
  });

  reviews.delete('/:id', (req, res, next) => {
    handler.deleteReview(req.params.id, (reviewId) => {
      if (reviewId) res.sendStatus(200);
      else res.sendStatus(404);

      next();
    });
  });

  return reviews;
}

module.exports = Reviews();