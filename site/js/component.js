var Component = Class.extend({
	init: function (PARENT){
		this.name = "Component";
		this.PARENT = PARENT;
		this.status = 0;
	},
	name: function (){
		return this.name;
	},
	update: function (gd, delta){
		
	},
	dying: function(gd){
		
	},
	render: function (gd,screen){
		
	},
	read: function (packet){
		
	},
	send: function (users, io){
		return "";
	},
	sync: function (users, io){
		var packet = new Packet(new Date().getTime(),this.PARENT.id,4,[this.PARENT.id, this.name]);
		var json = JSON.stringify(packet);
		return "";
	}
});