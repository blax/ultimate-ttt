function FieldModel(x,y,parent,state) {
	var self = this;
	self.x = x;
	self.y = y;
	self.parent = parent;
	self.state = ko.observable(state || ' ');

	self.isLastMove = ko.computed(function(){
		return self.parent.parent.isLastMove(self);
	});
}
