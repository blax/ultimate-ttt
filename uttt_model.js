function BigBoardModel() {
	var self = this;

	self.nextSmallBoard = ko.observable(null);

	// big board setup
	self.big_rows = ko.observableArray();
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


	self.nextMove = 'O';
	self.switchMove = function() {
		self.nextMove = self.nextMove == 'O' ? 'X' : 'O';
	};

	self.makeMove = function(field) {
		var allowedBoard = !self.nextSmallBoard() || self.nextSmallBoard() == field.parent;
		if(allowedBoard && field.state() == ' '){
			field.state(self.nextMove);
			self.switchMove();
			var next = self.big_rows()[field.x].big_cols[field.y];
			self.nextSmallBoard(next);
		}
	};
}

function SmallBoardModel(parent, id) {
	var self = this;

	// board setup
	self.rows = ko.observableArray();
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

	self.activeSmallBoard = ko.computed(function() {
		var nsb = parent.nextSmallBoard();
		return (nsb && nsb !== self) ? "inactive-board" : 'active-board';
	});

}

function FieldModel(x,y,parent,state) {
	var self = this;
	self.x = x;
	self.y = y;
	self.parent = parent;
	self.state = ko.observable(state || ' ');
}




ko.applyBindings(new BigBoardModel());