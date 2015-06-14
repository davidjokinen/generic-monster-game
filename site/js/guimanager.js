var GuiManager = Class.extend({
	init: function (){
		this.elements = new Array();
		this.input = gInput;
		this.layer = 1;
	},
	add: function(element){
		element.manager = this;
		this.elements[this.elements.length] = element;
		this.sort();
	},
	sort: function(){
		function mycomparator(a,b) {
		  return a.index - b.index;
		}
		this.elements.sort(mycomparator);
	}
	remove: function(element){
		for(var i =0; i<this.elements.length;i++){
			if(this.elements[i] == element){
				someArray.splice(i,1); 
				return true;
			}
		}
		return false;
	},
	update: function(){
		for(var i =0; i<this.elements.length;i++){
			this.elements[i].update();
		}
	},
	render: function(screen){
		screen.changeFocus(1);
		for(var i =0; i<this.elements.length;i++){
			this.elements[i].render(screen);
		}
	}
});  	