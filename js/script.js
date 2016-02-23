angular.module("boardsApp", ['ngRoute'])
	.config(['$routeProvider', RouteProvider])
	.controller("BoardsCtrl", [ 'BoardsService', BoardsCtrl ])
	.controller("CalcCtrl", [ 'BulbInit', '$routeParams', CalcCtrl ])
	.controller("NotesCtrl", [ 'BoardsService', '$routeParams', NotesCtrl ])
	.factory("BoardsService", BoardsService)
	.factory("BulbInit", BulbInit);

function BulbInit(){
    var bulbs = [
        {"class": "inc", 	"title": "Halogen", 		"conversion": .0625},
        {"class": "hal", 	"title": "Incandescent", 	"conversion": .0450},
        {"class": "cfl", 	"title": "CFL", 			"conversion": .0146},
        {"class": "led", 	"title": "LED", 			"conversion": .0125}
    ];

    var getBulbs = function () {
        return bulbs;
    };

    return {
        getBulbs: getBulbs
    }
}

function CalcCtrl(BulbInit){
    this.bulbs = BulbInit.getBulbs();

	this.data = {
		brightness: "900",
		price: 0.34,
		hours: 4
	}

    // this.calcCost = function(conversion, data){
    // 	console.log("calcCost");
    //     return 365*(data.brightness * conversion/1000)*data.hours*data.price;
    // }

    // this.calcPower = function(conversion, brightness){
    //     return brightness * conversion;
    // }
}

function BoardsCtrl(BoardsService){
	this.boards = BoardsService.getBoards();

	this.newBoard = {
		title: "",
		desc: "",
		isPublic: false
	}

	this.remove = function remove(board){
		BoardsService.remove(board);
	}

	this.add = function add(newBoard){
		if ((newBoard.title != "") && (newBoard.desc != "")) {
			BoardsService.add(newBoard);

			newBoard.title = "";
			newBoard.desc = "";
			newBoard.isPublic = false;
		}
	}
};

function NotesCtrl(BoardsService, $routeParams) {
	console.log($routeParams);
	// body...
}

function BoardsService(){
	var boards = {
		'0': {
			title: "Title 1",
			desc: "Nice board",
			isPublic: false,
			notes: [],
			id: 0
		},
		'1': {
			title: "Title 2",
			desc: "Nice board 2",
			isPublic: true,
			notes: [],
			id: 1
		}
	};

	function _getBoards() {
		return boards;
	};

	function _remove(board) {
		console.log(board);
		delete boards[board.id];
	};

	function _add(newBoard) {
		var nextId = 0;

		while (boards[nextId])
			nextId++;

		boards[nextId] = {
			title: newBoard.title,
			desc: newBoard.desc,
			isPublic: newBoard.isPublic,
			note: [],
			id: nextId
		};
	};

	return {
		getBoards: _getBoards,
		remove: _remove, 
		add: _add 
	};
}

function RouteProvider($routeProvider) {
    $routeProvider
	    .when('/', {
	        templateUrl: 'partial/boards.html',
	        controller: 'BoardsCtrl as boardAll'
	    })
	    .when('/board/:boardId', {
	        templateUrl: 'partial/board.html',
	        controller: 'NotesCtrl as contentBoard'
	    })
	    .when('/calculator', {
	        templateUrl: 'partial/calculator.html',
	        controller: 'CalcCtrl as calc'
	    })
	    .otherwise({
	        redirectTo: '/'
	    });    
}