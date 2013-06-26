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
		field.state(self.nextMove);
		self.switchMove();
		self.nextSmallBoard({x: field.x, y: field.y});
	};


}

function SmallBoardModel(parent) {
	var self = this;

	// board setup
	self.rows = ko.observableArray();
	var makeRow = function(index) {
		var row = [];
		for(var i =0 ; i<3; i++) {
			row.push(new FieldModel(index, i, ' '));
		}
		return row;
	};
	for(var i = 0; i<3; i++) {
		self.rows.push({cols: makeRow(i)});
	}

	self.activeSmallBoard = ko.computed(function() {
		var nsb = parent.nextSmallBoard();
		if(nsb){
			var active = parent.big_rows()[nsb.x].big_cols[nsb.y];
			return active == self ? "active-board" : "inactive-board";
		}
		else {
			return 'active-board';
		}
	});

}

function FieldModel(x,y,state) {
	var self = this;
	self.x = x;
	self.y = y;
	self.state = ko.observable(state || ' ');
}




ko.applyBindings(new BigBoardModel());