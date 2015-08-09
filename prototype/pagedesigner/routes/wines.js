"use strict";

var mongoose = require('mongoose');

// Default Schemaを取得
var Schema = mongoose.Schema;

// Defaultのスキーマから新しいスキーマを定義
var WineSchema = new Schema({
    name: String
  , year: String
  , grapes: String
  , country: String
  , region: String
  , description: String
  , picture: String
  , date: Date
});

// ドキュメント保存時にフックして処理したいこと
WineSchema.pre('save', function(next) {
  this.date = new Date();
  next();
});

// モデル化。model('[登録名]', '定義したスキーマクラス')
mongoose.model('Wine', WineSchema);

var Wine;

// mongodb://[hostname]/[dbname]
mongoose.connect('mongodb://localhost/winedb');

// mongoDB接続時のエラーハンドリング
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to 'winedb' database");
  // 定義したときの登録名で呼び出し
  Wine = mongoose.model('Wine');
  populateDB();
});

var winecontroller = {};

winecontroller.findAll = function(req, res) {
  console.log('Getting winelist');

  Wine.find({}, function(err, results) {
    if (err) {
      res.send({'error': 'An error has occurred'});
    } else {
      console.log('Success: Getting winelist');
      res.json(results);
    }
  });
};

winecontroller.findById = function(req, res) {
  var id = req.params.id;
  console.log('Retrieving wine: ' + id);

  Wine.findById(id, function(err, result) {
    if (err) {
      res.send({'error': 'An error has occurred'});
    } else {
      console.log('Success: ' + JSON.stringify(result));
      res.json(result);
    }
  });
};

winecontroller.addWine = function(req, res) {
  var wine = req.body;
  console.log('Adding wine: ' + JSON.stringify(wine));

  var addwine = new Wine(wine);
  addwine.save(function(err, result) {
    if (err) {
      res.send({'error': 'An error has occurred'});
    } else {
      console.log('Success: ' + JSON.stringify(result));
      res.json(result);
    }
  });
};

winecontroller.updateWine = function(req, res) {
  var id = req.params.id;
  console.log('Updating wine: ' + id);

  var wine = req.body;
  delete wine._id;
  Wine.findByIdAndUpdate(id, wine, function(err, result) {
    if (err) {
      res.send({'error': 'An error has occurred - ' + err});
    } else {
      console.log('Success: ' + result + ' document(s) updated');
      res.send(wine);
    }
  });
};

winecontroller.deleteWine = function(req, res) {
  var id = req.params.id;
  console.log('Deleting wine: ' + id);

  Wine.findByIdAndRemove(id, function(err, result) {
    if (err) {
      res.send({'error': 'An error has occurred - ' + err});
    } else {
      console.log('Success: ' + result + ' document(s) deleted');
      res.send(req.body);
    }
  });
};

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var wines = [
    {
        name: "CHATEAU DE SAINT COSME",
        year: "2009",
        grapes: "Grenache / Syrah",
        country: "France",
        region: "Southern Rhone",
        description: "The aromas of fruit and spice...",
        picture: "saint_cosme.jpg"
    },
    {
        name: "LAN RIOJA CRIANZA",
        year: "2006",
        grapes: "Tempranillo",
        country: "Spain",
        region: "Rioja",
        description: "A resurgence of interest in boutique vineyards...",
        picture: "lan_rioja.jpg"
    }];

  Wine.remove(function(err) {
    if (err) {
      res.send({'error': 'An error has occurred - ' + err});
    }
  });

  Wine.create(wines, function(err) {
    if (err) {
      res.send({'error': 'An error has occurred - ' + err});
    }
  });

};

var express = require('express');
var router = express.Router();

// 一枚処理を挟めるようにするか、それともハンドラを直指定するか
// router.get('/', function(req, res, next) {
//   console.log('get wines....');
//   winecontroller.findAll(req, res);
// });

router.get('/', winecontroller.findAll);
router.get   ('/:id', winecontroller.findById);
router.post  ('/',     winecontroller.addWine);
router.put   ('/:id', winecontroller.updateWine);
router.delete('/:id', winecontroller.deleteWine);

module.exports = router;

