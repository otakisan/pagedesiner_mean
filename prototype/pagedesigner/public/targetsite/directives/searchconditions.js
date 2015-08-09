(function () {
	angular.module('searchConditionsLib', [])
		.directive('searchConditions', function () {
		// templateUrlは、ディレクティブを呼び出しているページからの相対パス
		// ルートからの相対パスにして、どこからでも使えるようにする
		return {
			restrict: 'E',
			templateUrl: '/targetsite/directives/searchconditions.html',
			controller: ['$http', '$element', function ($http, $element) {
				// ケアレスミスを防ぐため、最初にthisを移し替えることをルールとしたほうがいいのかも
				var thisController = this;
				thisController.formId = $element[0].attributes['data-pg-formid'].value;
			
				// コントロールアイテム
				//thisController.toolItems = {};
			
				// コントロールアイテムを取得
				//$http.get('/resources/toolItems.json').success(function (data) {
				$http.get(`/pageitems/formid/${thisController.formId}`).success(function (data) {
					thisController.pageItems = data;
					for(var piIndex in thisController.pageItems){
						var pi = thisController.pageItems[piIndex];
						var el = document.getElementById(pi.parentId);
						if(el) {
							var newelement = document.createElement(pi.toolItem.ctrlData.tagName);
							for (var key in pi.toolItem.ctrlData.attrs) {
								newelement[key] = pi.toolItem.ctrlData.attrs[key];
							}			
							el.appendChild(newelement);							
						}
					}
					
					// (function(){
					// 	var createElementFunc = function(element) {
					// 		console.log(element.tagName, element.id);
					// 		var piret = thisController.pageItems.filter(function(pi){return pi.parentId === element.id});
					// 		if(piret.length > 0){
					// 			for(var piretIndex in piret){
					// 				var newelement = document.createElement(piret[piretIndex].toolItem.ctrlData.tagName);
					// 				for (var key in piret[piretIndex].toolItem.ctrlData.attrs) {
					// 					newelement[key] = piret[piretIndex].toolItem.ctrlData.attrs[key];
					// 				}			
					// 				element.appendChild(newelement);	
					// 			}
					// 		}
							
					// 		if(element.children && element.children.length > 0) {
					// 			var childrenEle = element.children;
					// 			for(var i in childrenEle) {
					// 				(function(childIndex){
					// 					createElementFunc(childrenEle[childIndex]);				
					// 				})(i);
					// 			}							
					// 		}
							
					// 	};
											
					// 	createElementFunc($element[0]);
					// })();
				});
				
				// $element[0].ondragstart = function toolItem_dragstart(event) {
				// 	// ドラッグするデータのid名をDataTransferオブジェクトにセット
				// 	event.dataTransfer.setData(
				// 		"drag-data-toolitem", 
				// 		JSON.stringify(thisController.toolItems.items.filter(function(it){
				// 			return it.itemId === event.target.attributes['data-pg-toolitemid'].value
				// 			}).map(function(ite){ite.formId = thisController.formId;return ite;})[0]));
				// };
			}],
			controllerAs: 'searchConditionsController'
		};
	});
})();