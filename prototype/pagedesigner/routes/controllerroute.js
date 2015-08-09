module.exports = function (app, controller) {
	var express = require('express');
	
	var winerouter = express.Router();
	winerouter.get('/', controller.wine.findAll);
	winerouter.get('/:id', controller.wine.findById);
	winerouter.post('/', controller.wine.addWine);
	winerouter.put('/:id', controller.wine.updateWine);
	winerouter.delete('/:id', controller.wine.deleteWine);
	app.use('/wines', winerouter);

	var toolitemrouter = express.Router();
	toolitemrouter.get('/', controller.toolitem.findAll);
	toolitemrouter.get('/:id', controller.toolitem.findById);
	toolitemrouter.get('/formid/:formId', controller.toolitem.findByFormId);
	// toolitemrouter.post('/', controller.toolitem.addToolItem);
	// toolitemrouter.put('/:id', controller.toolitem.updateToolItem);
	// toolitemrouter.delete('/:id', controller.toolitem.deleteToolItem);
	app.use('/toolitems', toolitemrouter);
	
	var pageitemrouter = express.Router();
	pageitemrouter.get('/', controller.pageitem.findAll);
	pageitemrouter.get('/:id', controller.pageitem.findById);
	pageitemrouter.get('/formid/:formId', controller.pageitem.findByFormId);
	pageitemrouter.post('/', controller.pageitem.addPageItem);
	pageitemrouter.put('/:id', controller.pageitem.updatePageItem);
	pageitemrouter.delete('/:id', controller.pageitem.deletePageItem);
	app.use('/pageitems', pageitemrouter);
};
