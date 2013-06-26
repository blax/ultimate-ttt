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
		if(allowedBoard && field.state() == ' '){
			field.state(self.nextMove());
			self.switchMove();
			self.lastMove(field);
			var next = self.big_rows[field.x].big_cols[field.y];
			self.nextSmallBoard(next);
		}
		if(allowedBoard && field.parent.isFilled()){
			self.switchMove();
			self.lastMove(null);
			var next = self.big_rows[field.x].big_cols[field.y];
			self.nextSmallBoard(next);
		}

	};
	
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
		// @TODO: check if dependency chain computes a state of a board
		// when another board changes and we need to check big-board state
		// @TODO: compute board-mirror in simple 2d array to optimize
		var diagACount = {'O': 0, 'X': 0};
		var diagBCount = {'O': 0, 'X': 0};
		for(var i = 0; i<3; i++) {
			var colCount = {'O': 0, 'X': 0};
			var rowCount = {'O': 0, 'X': 0};
			for(var j = 0; j<3; j++) {
				colCount[self.rows[i].cols[j].state()]++;
				rowCount[self.rows[j].cols[i].state()]++;
			}
			if(colCount['O'] == 3 || rowCount['O'] == 3){
				return 'O';
			}
			if(colCount['X'] == 3 || rowCount['X'] == 3){
				return 'X';
			}
			diagACount[self.rows[i].cols[i].state()]++;
			diagBCount[self.rows[2-i].cols[i].state()]++;
		}
		if(diagACount['O'] == 3 || diagBCount['O'] == 3){
			return 'O';
		}
		if(diagACount['X'] == 3 || diagBCount['X'] == 3){
			return 'X';
		}
		return false;
	});

	self.boardState = ko.computed(function() {
		// @TODO: active and won are separate things, after winning the boards still can be used
		var nsb = parent.nextSmallBoard();
		var w = self.winner()
		if(w){
			self.winner.dispose();
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