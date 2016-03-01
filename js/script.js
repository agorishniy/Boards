(function () {
	angular
		.module('boardsApp', ['ngRoute'])
		.config(['$routeProvider', RouteProvider])
		.controller('BoardsCtrl', [ 'BoardsService', BoardsCtrl ])
		.controller('CalcCtrl', [ 'BulbInit', 'CalcService', CalcCtrl ])
		.controller('NotesCtrl', [ 'BoardsService', '$routeParams', NotesCtrl ])
		.factory('CalcService', CalcService)
		.factory('BoardsService', BoardsService)
		.factory('BulbInit', BulbInit)
		.directive('boardRemove', BoardRemove)
		.directive('boardTitle', BoardTitle)
		.directive('boardDesc', BoardDesc)
		.directive('boardPublic', BoardPublic)
		.directive('boardIn', BoardIn);

	function BoardRemove(){
		return {
			template: '<button type="button" class="top-right-corner" ng-click="boardAll.remove(board)">' + 
					  '<span class="glyphicon glyphicon-remove" ></span>' + 
        			  '</button>'
		};
	};

	function BoardTitle(){
		return {
			template: '<div>' + 
					  '<input type="text" class="medium" placeholder="Board Title" ng-model="board.title">' + 
        			  '</div>'
		};
	};

	function BoardDesc(){
		return {
			template: '<div>' + 
					  '<input type="text" placeholder="Board description." ng-model="board.desc">' + 
        			  '</div>'
		};
	};

	function BoardPublic(){
		return {
			template: '<div class="bottom x-small">' + 
					  '<input type="checkbox" ng-model="board.isPublic">' + 
					  'Board is Public' + 
        			  '</div>'
		};
	};

	function BoardIn(){
		return {
			template: '<a href="#/board/{{ board.id }}" type="button" class="view bottom-right-corner">' + 
					  '<span class="glyphicon glyphicon-arrow-right"></span>' + 
        			  '</a>'
		};
	};

	function BulbInit(){
		var BulbInit = {};

		BulbInit.data = {
			brightness: '900',
			price: 0.34,
			hours: 4,
		    bulbs: [
		        {'class': 'inc', 	'title': 'Halogen', 		'conversion': .0625},
		        {'class': 'hal', 	'title': 'Incandescent', 	'conversion': .0450},
		        {'class': 'cfl', 	'title': 'CFL', 			'conversion': .0146},
		        {'class': 'led', 	'title': 'LED', 			'conversion': .0125}
		    ]
		};

	    return BulbInit;
	};

	function CalcCtrl(BulbInit, CalcService){ 
	    this.data = BulbInit.data;

	    this.calcCost = CalcService.calcCost;
	    this.calcPower = CalcService.calcPower;
	};

	function CalcService(){
		var CalcService = {};

	    CalcService.calcCost = function(conversion, data){
	        return 365*(data.brightness * conversion/1000)*data.hours*data.price;
	    };

	    CalcService.calcPower = function(conversion, brightness){
	        return brightness * conversion;
	    };

	    return CalcService;
	};

	function BoardsCtrl(BoardsService){
		this.boards = BoardsService.boards;
		this.newBoard = BoardsService.newBoard;

		this.remove = BoardsService.remove;
		this.add = BoardsService.add;
	};

	function NotesCtrl(BoardsService, $routeParams) {
		console.log($routeParams);
		// body...
	};

	BoardsService.$inject = ['$http', '$q'];

	function BoardsService($http, $q){
		var BoardsService = {};
		
		BoardsService.boards = {};

		// BoardsService.boards = {
		// 	'0': {
		// 		title: 'Title 1',
		// 		desc: 'Nice board',
		// 		isPublic: false,
		// 		notes: [],
		// 		id: 0
		// 	},
		// 	'1': {
		// 		title: 'Title 2',
		// 		desc: 'Nice board 2',
		// 		isPublic: true,
		// 		notes: [],
		// 		id: 1
		// 	}
		// };


		BoardsService.newBoard = {
			title: '',
			desc: '',
			isPublic: false
		};

		BoardsService.remove = function(board) {
			delete BoardsService.boards[board.id];
		};

		BoardsService.add = function(newBoard) {
			var nextId = 0;

			if ((newBoard.title != '') && (newBoard.desc != '')) {
				while (BoardsService.boards[nextId])
					nextId++;

				BoardsService.boards[nextId] = {
					title: newBoard.title,
					desc: newBoard.desc,
					isPublic: newBoard.isPublic,
					note: [],
					id: nextId
				};

				newBoard.title = '';
				newBoard.desc = '';
				newBoard.isPublic = false;
			}
		};

		function _load() {
			// создаем объект из которого получим Promise
		//	var deferred = $q.defer();
//				url = 'https://torrid-inferno-2999.firebaseio.com/board.json';

			// $http.get возвращает свой Promise объект
			var promiseFromHttp = $http.get('https://torrid-inferno-2999.firebaseio.com/boards.json');

			// в случае успеха сообщаем нашему Promise объекту, что все ок
			promiseFromHttp.then(function(response){
				var newBoard = {};

				$.each(response.data, function(board){
					newBoard.title = response.data[board].title;
					newBoard.desc = response.data[board].description;
					newBoard.id = response.data[board].id;
					newBoard.isPublic = response.data[board].isPublic;

					BoardsService.add(newBoard);
				});
			});

			// возвращаем наш Promise объект
			//return deferred.promise;
		};

		// load init data from database
		_load();

// test asyn
		function getFile(file){
			var startTime = new Date().getTime();

			$http.get(file).then(function(result){
				console.log("File", "\"" + file + "\"", "was loaded. Load time: ", (new Date().getTime()) - startTime, "ms");
			})
		};

		getFile('http://localhost:8080/files/JavaScript.pdf');
		getFile('http://localhost:8080/files/test_file2.txt');
		getFile('http://localhost:8080/files/test_file1.txt');
// end test asyn


 		return BoardsService;
	};

	function RouteProvider($routeProvider) {
	    $routeProvider
		    .when('/', {
		        templateUrl: 'partial/boards.html',
		        controller: 'BoardsCtrl',
		        controllerAs: 'boardAll'
		    })
		    .when('/board/:boardId', {
		        templateUrl: 'partial/board.html',
		        controller: 'NotesCtrl',
		        controllerAs: 'contentBoard'
		    })
		    .when('/calculator', {
		        templateUrl: 'partial/calculator.html',
		        controller: 'CalcCtrl',
		        controllerAs: 'calc'
		    })
		    .otherwise({
		        redirectTo: '/'
		    });    
	};
})();