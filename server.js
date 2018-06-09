var express = require('express'),
  logger = require('morgan'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser'),
  config = require('./config.json');

var apidoc = require('./hydra/apidoc.json'),
  entrypoint = require('./hydra/entrypoint.json');

// Init middlewares.
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Set header to serve JSON-LD content to clients.
app.use((req, res, next) => {
  res.contentType('application/ld+json');
  res.setHeader('Link', '<https://sws-group-7-hotel-api.herokuapp.com/api/v1/vocab/>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"');
  next();
});

app.get(config.namespace + '/', (req, res, next) => {
  res.send(entrypoint);
  next();
});

app.get(config.namespace + '/vocab', (req, res, next) => {
  res.send(apidoc);
  next();
});

app.get(config.namespace + '/contexts/:resource', (req, res, next) => {
  res.send(require('./hydra/contexts/' + req.params.resource + '.json'));
  next();
});

// app.use(config.namespace + '/users', require('./app/routes/users'));
// app.use(config.namespace + '/hotels', require('./app/routes/hotels'));
// app.use(config.namespace + '/rooms', require('./app/routes/rooms'));
// app.use(config.namespace + '/bookings', require('./app/routes/bookings'));
// app.use(config.namespace + '/reviews', require('./app/routes/reviews'));
// app.use(config.namespace + '/facilities', require('./app/routes/facilities'));
// app.use(config.namespace + '/categories', require('./app/routes/facility_categories'));
app.use(config.namespace + '/locations', require('./app/routes/locations'));
app.use(config.namespace + '/media', require('./app/routes/media'));

// enable logging requests
app.use(logger('dev'));

app.listen(port, () => {
  console.log('RESTful Web Server started on *:' + port);
});