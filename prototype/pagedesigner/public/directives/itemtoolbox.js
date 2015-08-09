(function () {
	angular.module('itemToolBoxLib', [])
		.directive('itemToolBox', function () {
		// templateUrlは、ディレクティブを呼び出しているページからの相対パス
		// ルートからの相対パスにして、どこからでも使えるようにする
		return {
			restrict: 'E',
			templateUrl: '/directives/itemtoolbox.html',
			controller: ['$http', '$element', function ($http, $element) {
				// ケアレスミスを防ぐため、最初にthisを移し替えることをルールとしたほうがいいのかも
				var thisController = this;
				thisController.formId = $element[0].attributes['data-pg-formid'].value;
			
				// コントロールアイテム
				//thisController.toolItems = {};
			
				// コントロールアイテムを取得
				//$http.get('/resources/toolItems.json').success(function (data) {
				$http.get(`/toolitems/formid/${thisController.formId}`).success(function (data) {
					thisController.toolItems = data[0];
				});
				
				$element[0].ondragstart = function toolItem_dragstart(event) {
					// ドラッグするデータのid名をDataTransferオブジェクトにセット
					event.dataTransfer.setData(
						"drag-data-toolitem", 
						JSON.stringify(thisController.toolItems.items.filter(function(it){
							return it.itemId === event.target.attributes['data-pg-toolitemid'].value
							}).map(function(ite){ite.formId = thisController.formId;return ite;})[0]));
				};
			}],
			controllerAs: 'itemToolBoxController'
		};
	});
})();