"use strict";

module.exports = (function () {

  var mongoose = require('mongoose');

  // Default Schemaを取得
  var Schema = mongoose.Schema;

  // Defaultのスキーマから新しいスキーマを定義
  var ToolItemSchema = new Schema({
    formId: { type: String, index: { unique: true }}
    , items: [{
      itemId: String
      , ctrlType: String
      , ctrlTagText: String
      , ctrlData: {
        tagName: String,
        attrs: {
          type: {type: String}, // typeがキーワードのため、type: Stringでは動作しない
          maxLength: String
        }
      },
      label: String
    }]
  });

  // ドキュメント保存時にフックして処理したいこと
  ToolItemSchema.pre('save', function (next) {
    this.date = new Date();
    next();
  });

  // モデル化。model('[登録名]', '定義したスキーマクラス')
  mongoose.model('ToolItem', ToolItemSchema);

  var ToolItem;

  // mongodb://[hostname]/[dbname]
  // mongoDB接続時のエラーハンドリング
  //mongoose.connect('mongodb://localhost/pagedesignerdb');
  //var db = mongoose.connection
  var db = mongoose.createConnection('mongodb://localhost/pagedesignerdb');
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log("Connected to 'pagedesignerdb' database");
    // 定義したときの登録名で呼び出し
    ToolItem = db.model('ToolItem');
    populateDB();
  });

  var toolitemcontroller = {};

  toolitemcontroller.findAll = function (req, res) {
    console.log('Getting toolItemlist', req.query);

    ToolItem.find({}, function (err, results) {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        console.log('Success: Getting toolItemlist');
        res.json(results);
      }
    });
  };

  toolitemcontroller.findById = function (req, res) {
    var id = req.params.id;
    console.log('Retrieving toolItem: ' + id);

    ToolItem.findById(id, function (err, result) {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        console.log('Success: ' + JSON.stringify(result));
        res.json(result);
      }
    });
  };
  
  toolitemcontroller.findByFormId = function (req, res) {
    console.log('findByFormId', req.params);
    var id = req.params.formId;
    console.log('Retrieving toolItem by formid: ' + id);

    ToolItem.find({formId: id}, function (err, result) {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        console.log('Success: ' + JSON.stringify(result));
        res.json(result);
      }
    });
  };

  toolitemcontroller.addToolItem = function (req, res) {
    var toolItem = req.body;
    console.log('Adding toolItem: ' + JSON.stringify(toolItem));

    var addtoolItem = new ToolItem(toolItem);
    addtoolItem.save(function (err, result) {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        console.log('Success: ' + JSON.stringify(result));
        res.json(result);
      }
    });
  };

  toolitemcontroller.updateToolItem = function (req, res) {
    var id = req.params.id;
    console.log('Updating toolItem: ' + id);

    var toolItem = req.body;
    delete toolItem._id;
    ToolItem.findByIdAndUpdate(id, toolItem, function (err, result) {
      if (err) {
        res.send({ 'error': 'An error has occurred - ' + err });
      } else {
        console.log('Success: ' + result + ' document(s) updated');
        res.send(toolItem);
      }
    });
  };

  toolitemcontroller.deleteToolItem = function (req, res) {
    var id = req.params.id;
    console.log('Deleting toolItem: ' + id);

    ToolItem.findByIdAndRemove(id, function (err, result) {
      if (err) {
        res.send({ 'error': 'An error has occurred - ' + err });
      } else {
        console.log('Success: ' + result + ' document(s) deleted');
        res.send(req.body);
      }
    });
  };

  /*--------------------------------------------------------------------------------------------------------------------*/
  // Populate database with sample data -- Only used once: the first time the application is started.
  // You'd typically not find this code in a real-life app, since the database would already exist.
  var populateDB = function () {

    var toolItems = [
      {
        "formId": "HSMO0001F01",
        "items": [
          {
            "itemId": "userId",
            "ctrlType": "TXT",
            "ctrlTagText": "<div><input type='text' value='useridvalue'></div>",
            "ctrlData": {
              "tagName": "input",
              "attrs": {
                "type": "text",
                "maxLength": "12"
              }
            },
            "label": "ユーザーID"
          },
          {
            "itemId": "userName",
            "ctrlType": "TXT",
            "ctrlTagText": "<input type='text' value='useridvalue'>",
            "ctrlData": {
              "tagName": "input",
              "attrs": {
                "type": "text",
                "maxLength": "12"
              }
            },
            "label": "ユーザー名"
          },
          {
            "itemId": "createdAt",
            "ctrlType": "CAL",
            "ctrlTagText": "<input type='date'>",
            "ctrlData": {
              "tagName": "input",
              "attrs": {
                "type": "date",
                "maxLength": "12"
              }
            },
            "label": "登録日時"
          }
        ]
      }];

    // ToolItem.remove(function (err) {
    //   if (err) {
    //     res.send({ 'error': 'An error has occurred - ' + err });
    //   }
    // });

    console.log('create toolitem...');
    ToolItem.create(toolItems, function (err) {
    console.log('create toolitem completed...', err);
      if (err) {
        res.send({ 'error': 'An error has occurred - ' + err });
      }
    });

  };

  return toolitemcontroller;

})();