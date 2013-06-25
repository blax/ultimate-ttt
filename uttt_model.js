function BigBoardViewModel() {
	var self = this;

	// big board setup
	self.big_rows = ko.observableArray();
	var makeRow = function() {
		var row = [];
		for(var i =0 ; i<3; i++) {
			row.push(new SmallBoardViewModel());
		}
		return row;
	};
	for(var i=0; i<3; i++){
		self.big_rows.push({big_cols: makeRow()});
	}
	

	self.nextMove = 'O';
	self.switchMove = function() {
		self.nextMove = self.nextMove == 'O' ? 'X' : 'O';
	}
	self.nextSmallBoard = -1;

	self.makeMove = function() {
		this.state(self.nextMove);
		self.switchMove();
	}

}

function SmallBoardViewModel() {
	var self = this;

	// board setup
	self.rows = ko.observableArray()
	var makeRow = function(index) {
		var row = [];
		for(var i =0 ; i<3; i++) {
			row.push(new FieldViewModel(index, i, ' '));
		}
		return row;
	}
	for(var i = 0; i<3; i++) {
		self.rows.push({cols: makeRow(i)});
	}
}

function FieldViewModel(x,y,state) {
	var self = this;
	self.x = x;
	self.y = y;
	self.state = ko.observable(state || ' ');
}




ko.applyBindings(new BigBoardViewModel());