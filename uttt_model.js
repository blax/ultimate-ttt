function UTTTViewModel() {
	var self = this;

	self.big_rows = ko.observableArray();
	function makeSmall() {
		var small = {small_rows: []}
		for(var i=0; i<3; i++){
			small.small_rows.push({small_cols: [{cell: 'O'},{cell: 'X'},{cell: 'O'}]});
		}
		return small;
	}
	for(var i=0; i<3; i++){
		self.big_rows.push({big_cols: [makeSmall(), makeSmall(), makeSmall()]})
	}
	
}


ko.applyBindings(new UTTTViewModel());