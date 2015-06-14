var Respawn = Component.extend({
	init: function (PARENT, ID){
		this.name = "Respawn";
		this.PARENT = PARENT ;
		this.ID = ID;
		this.count = 3000;
		this.done = 0;
		this.show = 0;
		this.status = 0;
	},
	dying: function(gd){
		if(gd.type == 0){//server 
		
		}
	},
	update: function (gd, delta){
		if(gd.type == 0){//server 
			if(this.done == 1) return;
			this.count -= delta;
			if(this.count < 0){
				
				this.PARENT.status = 2;
				var x =200;
				var y=200;
				if(Math.random()>.8){
					x =2200;
				    y =200;
				}
				else if(Math.random()>.8){
					x =2800;
				    y =2200;
				}
				else if(Math.random()>.8){
					x =200;
				    y =2200;
				}
				else if(Math.random()>.8){
					x =1000;
				    y =900;
				}

				var e = new Entity(gd.idCount++,x+parseInt(100*Math.random()),y+parseInt(100*Math.random()),0);
				e.add(new Health(e,100,100));
				var items = new ItemController(e);
				items.add(new Shotgun(e));
				items.add(new Handgun(e));
				items.add(new Machinegun(e));
				e.add(items);
				e.add(new DefaultHuman(e,this.ID));
				gd.entities.push(e);
				this.done = 1;
				console.log('Player '+this.ID+' has spawned');
				
			}
		}
		else if(gd.type == 1){//client
			if(gd.userManager.userID == this.ID)this.show = 1;
				
		}
	},
	render: function (gd,screen){
		if(this.show == 0)return;
		var size = this.size;
		var ctx = screen.ctx;
		var c = gd.camera;
		ctx.fillStyle="#000";
		ctx.font=parseInt(60*gd.camera.scale)+"px code_pro_demoregular";
		var time = this.count/1000+1;
		var text = "Respawning in: "+parseInt(time);
		var w = (ctx.width - ctx.measureText(text).width)/2;
		ctx.fillText(text,w,ctx.height/2);
		ctx.font="10px sans-serif";
	},
	read: function (packet){
		var d = packet[3];

		this.ID = d[2];
		this.count = d[3];

	},
	send: function (users, io){
		var status = 5;
		if(this.status==0)  status = 4;
		var packet = [new Date().getTime(),this.PARENT.id,status,[this.PARENT.id, this.name,this.ID, this.count]];
		var json = JSON.stringify(packet);
		if(this.status==0) this.status =1;
		return json;
	},
	sync: function (users, io){
		var packet = [new Date().getTime(),this.PARENT.id,4,[this.PARENT.id, this.name,this.ID, this.count]];
		var json = JSON.stringify(packet);
		return json;
	}
});
