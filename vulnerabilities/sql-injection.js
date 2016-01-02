var express = require('express');
var DVNA = express();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

DVNA.set('db', db);

db.serialize(function() {
  db.run('CREATE TABLE users (login TEXT, password TEXT)');

  var stmt = db.prepare('INSERT INTO users VALUES (?, ?)');
  stmt.run('frank', 'fr4nk');
  stmt.run('bob', 'b0b');
  stmt.run('alice', '4l1c3');
  stmt.finalize();
});

DVNA.get('/users', function (req, res) {
  db.get('SELECT * FROM users WHERE `login`="frank"' + (req.query.order || ''), function (err, row) {
    res.send(row.login + ': ' + row.password);
    res.end();
  });
})

module.exports = {
  path: 'sql_injection',
  server: DVNA
}
