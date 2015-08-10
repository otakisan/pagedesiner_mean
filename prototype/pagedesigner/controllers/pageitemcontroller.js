"use strict";

module.exports = (function () {

  var mongoose = require('mongoose');

  // Default Schemaを取得
  var Schema = mongoose.Schema;

  // Defaultのスキーマから新しいスキーマを定義
  var PageItemSchema = new Schema({
    formId: String, toolItemId: String, offsetX: Number, offsetY: Number, parentId: String
  });
  PageItemSchema.index({ formId: 1, toolItemId: 1 }, { unique: true });

  // ドキュメント保存時にフックして処理したいこと
  PageItemSchema.pre('save', function (next) {
    this.date = new Date();
    next();
  });

  // モデル化。model('[登録名]', '定義したスキーマクラス')
  mongoose.model('PageItem', PageItemSchema);

  var PageItem;

  // mongodb://[hostname]/[dbname]
  // mongoDB接続時のエラーハンドリング
  //mongoose.connect('mongodb://localhost/pagedesignerdb');
  //var db = mongoose.connection
  var db = mongoose.createConnection('mongodb://localhost/pagedesignerdb');
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log("Connected to 'pagedesignerdb' database");
    // 定義したときの登録名で呼び出し
    PageItem = db.model('PageItem');
    //populateDB();
  });

  var pageitemcontroller = {};

  pageitemcontroller.findAll = function (req, res) {
    console.log('Getting pageItemlist', req.query);

    PageItem.find({}, function (err, results) {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        console.log('Success: Getting pageItemlist');
        res.json(results);
      }
    });
  };

  pageitemcontroller.findById = function (req, res) {
    var id = req.params.id;
    console.log('Retrieving pageItem: ' + id);

    PageItem.findById(id, function (err, result) {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        console.log('Success: ' + JSON.stringify(result));
        res.json(result);
      }
    });
  };

  pageitemcontroller.findByFormId = function (req, res) {
    console.log('findByFormId', req.params);
    var id = req.params.formId;
    console.log('Retrieving pageItem by formid: ' + id);

    PageItem.find({ formId: id }, { _id: 0, __v: 0 }, function (err, result) {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        db.model('ToolItem').find({ "formId": id }, { "items._id": 0 }, function (errToolItems, resultToolItems) {
          if (errToolItems) {
            res.send({ 'error': 'An error has occurred on fetching toolitems and pageitems' });
          } else {
            var newResults = [];
            for (var pageItemIndex in result) {
              (function (idx) {
                var tlResult = resultToolItems.map(function (ele) {
                  return ele.items
                })[0].filter(function (ti) {
                  return ti.itemId === result[idx].toolItemId
                })[0];

                result[idx].toolItem = tlResult;
                
                // JSON化の対象にするプロパティのみを持つオブジェクトでまとめる。
                // stringifyはtoJson関数を持つオブジェクトの値を返却するようで、
                // 単純に、元の結果のプロパティに足すだけでは出力されない
                var newResultObj = JSON.parse(JSON.stringify(result[idx]));
                newResultObj.toolItem = tlResult;
                newResults.push(newResultObj);
              })(pageItemIndex);
            }
            console.log('Success: ' + JSON.stringify(newResults));
            res.json(newResults);
          }
        });
      }
    });
  };

  pageitemcontroller.addPageItem = function (req, res) {
    console.log('addpageitem:body:', req.body);
    console.log('addpageitem:params:', req.params);
    var pageItem = req.body;
    console.log('Adding pageItem: ' + JSON.stringify(pageItem));

    var addpageItem = new PageItem(pageItem);
    addpageItem.save(function (err, result) {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        console.log('Success: ' + JSON.stringify(result));
        res.json(result);
      }
    });
  };

  pageitemcontroller.updatePageItem = function (req, res) {
    var id = req.params.id;
    console.log('Updating pageItem: ' + id);

    var pageItem = req.body;
    delete pageItem._id;
    PageItem.findByIdAndUpdate(id, pageItem, function (err, result) {
      if (err) {
        res.send({ 'error': 'An error has occurred - ' + err });
      } else {
        console.log('Success: ' + result + ' document(s) updated');
        res.send(pageItem);
      }
    });
  };

  pageitemcontroller.deletePageItem = function (req, res) {
    var id = req.params.id;
    console.log('Deleting pageItem: ' + id);

    PageItem.findByIdAndRemove(id, function (err, result) {
      if (err) {
        res.send({ 'error': 'An error has occurred - ' + err });
      } else {
        console.log('Success: ' + result + ' document(s) deleted');
        res.send(req.body);
      }
    });
  };

  pageitemcontroller.deleteAll = function (req, res) {
    console.log('Deleting all the pageItems');

    PageItem.remove({}, function (err, result) {
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

    var pageItems = [
      {
        "formId": "HSMO0001F01",
        "toolItemId": "userId",
        "offsetX": 241,
        "offsetY": 39
      },
      {
        "formId": "HSMO0001F01",
        "toolItemId": "userName",
        "offsetX": 239,
        "offsetY": 56
      },
      {
        "formId": "HSMO0001F01",
        "toolItemId": "createdAt",
        "offsetX": 255,
        "offsetY": 57
      }
    ];

    // PageItem.remove(function (err) {
    //   if (err) {
    //     res.send({ 'error': 'An error has occurred - ' + err });
    //   }
    // });

    console.log('create pageitem...');
    PageItem.create(pageItems, function (err) {
      console.log('create pageitem completed...', err);
      if (err) {
        res.send({ 'error': 'An error has occurred - ' + err });
      }
    });

  };

  return pageitemcontroller;

})();