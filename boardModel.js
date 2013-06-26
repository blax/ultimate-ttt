function ticTacToeWinner(board) {
	var diagACount = {'O': 0, 'X': 0};
	var diagBCount = {'O': 0, 'X': 0};
	for(var i = 0; i<3; i++){
		var colCount = {'O': 0, 'X': 0};
		var rowCount = {'O': 0, 'X': 0};
		for(var j = 0; j<3; j++) {
			colCount[board[i][j]]++;
			rowCount[board[j][i]]++;
		}
		if(colCount['O'] == 3 || rowCount['O'] == 3){
				return 'O';
		}
		if(colCount['X'] == 3 || rowCount['X'] == 3){
			return 'X';
		}
		diagACount[board[i][i]]++;
		diagBCount[board[i][2-i]]++;
	}
	if(diagACount['O'] == 3 || diagBCount['O'] == 3){
			return 'O';
	}
	if(diagACount['X'] == 3 || diagBCount['X'] == 3){
		return 'X';
	}
	return false;
}

function BigBoardModel() {
	var self = this;

	self.nextSmallBoard = ko.observable(null);

	self.lastMove = ko.observable(null);
	self.nextMove = ko.observable('O');
	self.switchMove = function() {
		self.nextMove(self.nextMove() == 'O' ? 'X' : 'O');
	};

	self.isLastMove = function(field){
		return field === self.lastMove();
	};

	self.makeMove = function(field) {
		var allowedBoard = !self.nextSmallBoard() || self.nextSmallBoard() == field.parent;
		var next = self.big_rows[field.x].big_cols[field.y];
		if(self.winner()){
			return false;
		}
		if(allowedBoard && field.state() == ' '){
			field.state(self.nextMove());
			self.switchMove();
			self.lastMove(field);
			self.nextSmallBoard(next);
		}
		if(allowedBoard && field.parent.isFilled()){
			self.switchMove();
			self.lastMove(null);
			self.nextSmallBoard(next);
		}

	};

	self.winner = ko.computed(function() {
		var board = [];
		for(var i = 0; i < 3; i++){
			var row = [];
			for(var j = 0; j < 3; j++) {
				row.push(self.big_rows[i].big_cols[j].winner());
			}
			board.push(row);
		}
		return ticTacToeWinner(board);
	}, self, {deferEvaluation: true, disposeWhen: function(){return self.winner()}});

	// big board setup
	self.big_rows = [];
	var makeRow = function() {
		var row = [];
		for(var i =0 ; i<3; i++) {
			row.push(new SmallBoardModel(self));
		}
		return row;
	};
	for(var i=0; i<3; i++){
		self.big_rows.push({big_cols: makeRow()});
	}
}

function SmallBoardModel(parent, id) {
	var self = this;
	self.parent = parent;
	// board setup
	self.rows = [];
	var makeRow = function(index) {
		var row = [];
		for(var i =0 ; i<3; i++) {
			row.push(new FieldModel(index, i, self, ' '));
		}
		return row;
	};
	for(var i = 0; i<3; i++) {
		self.rows.push({cols: makeRow(i)});
	}

	self.winner = ko.computed(function() {
		var board = [];
		for(var i = 0; i < 3; i++){
			var row = [];
			for(var j = 0; j < 3; j++) {
				row.push(self.rows[i].cols[j].state());
			}
			board.push(row);
		}
		return ticTacToeWinner(board);
	}, self, {deferEvaluation: true, disposeWhen: function(){return self.winner()}});

	self.boardState = ko.computed(function() {
		// @TODO: active and won are separate things, after winning the boards still can be used
		var nsb = parent.nextSmallBoard();
		var w = self.winner()
		if(w){
			return "won-board-" + w;
		}
		else{
			return (nsb && nsb !== self) ? "inactive-board" : 'active-board';	
		}
	});

	self.isFilled = ko.computed(function() {
		for (var i = 0; i<3; i++){
			for(var j = 0; j<3; j++) {
				if(self.rows[i].cols[j].state()==' '){
					return false;
				}
			}
		}
		return true;
	});

}





ko.applyBindings(new BigBoardModel());