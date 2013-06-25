function UTTTViewModel() {
	var self = this;

	self.big_rows = ko.observableArray();
	function makeSmall() {
		var small = {small_rows: []}
		for(var i=0; i<3; i++){
			small.small_rows.push({small_cols: [new FieldViewModel('O'), new FieldViewModel('O'), new FieldViewModel('O')]});
		}
		return small;
	}
	for(var i=0; i<3; i++){
		self.big_rows.push({big_cols: [makeSmall(), makeSmall(), makeSmall()]})
	}
	
}

function FieldViewModel(state) {
	var self = this;
	// self.x = x;
	// self.y = y;
	self.state = ko.observable(state || ' ');
}


ko.applyBindings(new UTTTViewModel());