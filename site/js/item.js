var Item = Component.extend({
	init: function (PARENT){
		this.name = "Item";
		this.PARENT = PARENT;		
		this.title = "Default Item";
		this.owner = -1;
		this.itemID = -1;

		this.status = 0;
	},
	name: function (){
		return this.name;
	},
	update: function (gd, delta){
		if(gd.type == 0){//

		}
		else if(gd.type == 1){//
			
		}
	},
	action1: function (gd,screen){
		
	},
	action2: function (gd,screen){
		
	},
	render: function (gd,screen){
		var size = this.size;
		var ctx = screen.ctx;
		var c = gd.camera;
		
		
	},
	read: function (packet){
		var d = packet[3];
		this.owner = d[2];
	},
	send: function (users, io){
		var status = 5;
		if(this.status==0)  status = 4;
		//var packet = new Packet(new Date().getTime(),this.PARENT.id,status,[this.PARENT.id, this.name, this.size, this.r, this.g, this.b]);
		var packet = [new Date().getTime(),this.PARENT.id,status,[this.PARENT.id, this.name, this.owner]];
		
		var json = JSON.stringify(packet);
		if(this.status==0) this.status =1;

		return json;
	
	},
	sync: function (users, io){
		var packet = [new Date().getTime(),this.PARENT.id,4,[this.PARENT.id, this.name, this.owner]];
		var json = JSON.stringify(packet);
		return json;
	}
});
