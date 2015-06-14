var Lava = Component.extend({
	init: function (PARENT,w,h){
		this.name = "Lava";
		this.PARENT = PARENT;
		this.width = w;
		this.height = h;
		this.t = 0;
		this.status = 0;
		this.count = 0;

		this.activeTrail = 0;
		this.damaged = 2;
		this.PARENT.velX = 0;
			this.PARENT.velY = 0;
	},
	name: function (){
		return this.name;
	},
	dying: function(gd){
		
		
	},
	update: function (gd, delta){
		if(gd.type == 0){//
			
			var box = [this.PARENT.posX,this.PARENT.posY,this.PARENT.posX+this.width,this.PARENT.posY+this.height];
			for(var i =0;i<gd.entities.length;i++){
				var box2 = gd.entities[i].getBoxes(0);
				var arr = [box,box2];
				var result = gd.boxIntersect(arr,function(i,j) {return 1;});
				//console.log(arr);
				if(result != [][0]){

					var health = gd.entities[i].get("Health");
					if(health){
						health.health -= 1;
					}
				}
			}

		}
		else if(gd.type == 1){//
			this.count+=delta;
			
			
		}
	},
	render: function (gd,screen){
		var size = this.size;
		var ctx = screen.ctx;
		var c = gd.camera;
		
		var x1 = parseInt((parseInt(this.PARENT.posX))*c.scale-c.x);
		var y1 = parseInt((parseInt(this.PARENT.posY))*c.scale-c.y);
		
		var x2 = parseInt((parseInt(this.PARENT.posX))*c.scale-c.x)+this.width;
		var y2 = parseInt((parseInt(this.PARENT.posY))*c.scale-c.y)+this.height;
		
		if(x1<0)x1=0;
		if(x2<0)x2=0;
		if(y1<0)y1=0;
		if(y2<0)y2=0;
		if(x1>ctx.width)x1=ctx.width;
		if(x2>ctx.width)x2=ctx.width;
		if(y1>ctx.height)y1=ctx.height;
		if(y2>ctx.height)y2=ctx.height;

		ctx.fillStyle="#E88";
		ctx.fillRect(x1,y1,x2-x1,y2-y1);
	},
	read: function (packet){
		var d = packet[3];
		this.width = d[2];
		this.height = d[3];
		

	},
	send: function (users, io){
		var status = 5;
		if(this.status==0)  status = 4;
		//var packet = new Packet(new Date().getTime(),this.PARENT.id,status,[this.PARENT.id, this.name, this.size, this.r, this.g, this.b]);
		var packet = [new Date().getTime(),this.PARENT.id,status,[this.PARENT.id, this.name, parseInt(this.width),  parseInt(this.height)]];
		
		var json = JSON.stringify(packet);
		if(this.status==0) this.status =1;

		return json;//json;//json;//json;
	
	},
	sync: function (users, io){
		var packet = [new Date().getTime(),this.PARENT.id,4,[this.PARENT.id, this.name, parseInt(this.width),  parseInt(this.height)]];
		var json = JSON.stringify(packet);
		return json;
	}
});