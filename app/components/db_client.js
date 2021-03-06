'use strict';

var fs = require('fs');
var path = require('path');
var config = require('../../config');

module.exports = (dbName) => {
  var dbPath = path.resolve('./data/' + dbName + '.json');
  var db = require(dbPath);

  function _updateDB() {
    try {
      fs.writeFileSync(dbPath, JSON.stringify(db));

      return true;
    } catch (err) {
      console.log(err);
    }

    return false;
  }

  function _isInvalid(id) {
    return id < 0 || id >= db.length || (Object.keys(db[id]).length === 0 && db[id].constructor === Object);
  }

  var all = function () {
    return db;
  };

  var find = function (id) {
    return _isInvalid(id) ? null : db[id];
  };

  var create = function (entity, cb) {
    entity['id'] = config.ns + '/' + dbName + '/' + db.length;
    db.push(entity);

    if (_updateDB()) cb(entity);
    else cb();
  };

  var update = function (entity, cb) {
    var id = entity.id;
    if (id < 0 || id >= db.length) {
      cb();
    } else {
      entity.id = config.ns + '/' + dbName + '/' + id;
      db[id] = entity;

      if (_updateDB()) cb(entity);
      else cb();
    }
  };

  var remove = function (id) {
    // Check for boundries and if object to delete is already deleted.
    if (_isInvalid(id)) {
      return false;
    }

    db[id] = {};

    return _updateDB();
  };

  return {
    all,
    find,
    create,
    update,
    remove
  };
};