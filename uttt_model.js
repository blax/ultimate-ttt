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
	}
	for(var i=0; i<3; i++){
		self.big_rows.push({big_cols: makeRow()});
	}
	
}

function SmallBoardViewModel() {
	var self = this;

	// board setup
	self.rows = ko.observableArray()
	var makeRow = function() {
		var row = [];
		for(var i =0 ; i<3; i++) {
			row.push(new FieldViewModel('0'));
		}
		return row;
	}
	for(var i = 0; i<3; i++) {
		self.rows.push({cols: makeRow()});
	}
}

function FieldViewModel(state) {
	var self = this;
	// self.x = x;
	// self.y = y;
	self.state = ko.observable(state || ' ');
}




ko.applyBindings(new BigBoardViewModel());