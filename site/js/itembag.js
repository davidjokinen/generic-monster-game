var ItemBag = Component.extend({
	init: function (PARENT){
		this.name = "ItemBag";
		this.PARENT = PARENT;

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
	render: function (gd,screen){
		
	},
	read: function (packet){
		var d = packet[3];
		this.size = d[2];
		this.r = d[3];
		this.g = d[4];
		this.b = d[5];
		this.ID = d[6];
		this.color = "rgb("+parseInt(this.r)+","+parseInt(this.g)+","+parseInt(this.b)+")";

	},
	send: function (users, io){
		var status = 5;
		if(this.status==0)  status = 4;
		//var packet = new Packet(new Date().getTime(),this.PARENT.id,status,[this.PARENT.id, this.name, this.size, this.r, this.g, this.b]);
		var packet = [new Date().getTime(),this.PARENT.id,status,[this.PARENT.id, this.name, parseInt(this.size),  parseInt(this.r),  parseInt(this.g),  parseInt(this.b),this.ID]];
		
		var json = JSON.stringify(packet);
		if(this.status==0) this.status =1;

		return json;
	
	},
	sync: function (users, io){
		var packet = [new Date().getTime(),this.PARENT.id,4,[this.PARENT.id, this.name, parseInt(this.size),  parseInt(this.r),  parseInt(this.g),  parseInt(this.b),this.ID]];
		var json = JSON.stringify(packet);
		return json;
	}
});
