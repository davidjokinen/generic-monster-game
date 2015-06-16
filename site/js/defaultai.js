var DefaultAI = Component.extend({
	init: function (PARENT){
		this.name = "DefaultAI";
		this.PARENT = PARENT;
		this.size = 25+15*Math.random();
		this.r = 150+100*Math.random();
		this.g = 150+100*Math.random();
		this.b = 150+100*Math.random();
		this.color = "white";
		this.t = 0;
		this.status = 0;
		this.count = 0;
		this.trail = new Array(20);
		this.activeTrail = 0;
		this.damaged = 0;
		this.xp = 100;
	},
	name: function (){
		return this.name;
	},
	dying: function(gd){
		if(gd.type == 0){//
			
			var ent = this.PARENT.get("Health").hitBy;
			if(ent){
				var hum = ent.get("DefaultHuman");
				if(hum){
					var user2 = gd.userManager.getUser(hum.ID);
					if(user2){
						user2.info.monsterKills++;
						user2.info.xp += this.xp;
					}
				}
			}
			
		}
		
	},
	update: function (gd, delta){
		if(gd.type == 0){//
			if(this.PARENT.posX<0||this.PARENT.posX>3000)
				this.PARENT.velX = -this.PARENT.velX;
			if(this.PARENT.posY<0||this.PARENT.posY>2100)
				this.PARENT.velY = -this.PARENT.velY;

			
			//this.PARENT.r = (this.PARENT.r+360)%360;
			//this.r = 150+100*Math.random();
			//this.g = 150+100*Math.random();
			//this.b = 150+100*Math.random();

			if(Math.random() < .003){
				//this.PARENT.status = 2;
				//console.log(1);
			}
		}
		else if(gd.type == 1){//
			this.count+=delta;
			if(this.count >15){
				this.count = 0;
				this.trail[this.activeTrail*2] = this.PARENT.posX;
				this.trail[this.activeTrail*2+1] = this.PARENT.posY;
				this.activeTrail++;
				if(this.activeTrail==10)this.activeTrail=0;
			}
			
		}
	},
	render: function (gd,screen){
		if(1)return;
		var graphics = new PIXI.Graphics();
			var c = gd.camera;
		graphics.beginFill(0xFF8888);
		graphics.drawRect(this.PARENT.posX-c.x, this.PARENT.posY-c.y,40,40);
		gd.stage.addChild(graphics);
		if(1)return;
		var size = this.size;
		var ctx = screen.ctx;
	
		ctx.strokeStyle="#DDF";
		ctx.beginPath();
		var len = this.trail.length/2;
		for(var i =0;i<len&&0;i++){
		    if(i==0)ctx.moveTo((this.trail[(this.activeTrail+i)%len*2]+size/2)*c.scale-c.x, (this.trail[(this.activeTrail+i)%len*2+1]+size/2)*c.scale-c.y);
		    else ctx.lineTo((this.trail[(this.activeTrail+i)%len*2]+size/2)*c.scale-c.x, (this.trail[(this.activeTrail+i)%len*2+1]+size/2)*c.scale-c.y);
		}
		ctx.stroke();
		
		ctx.fillStyle=this.color;
		ctx.save();
		ctx.translate(parseInt((parseInt(this.PARENT.posX+size/2))*c.scale-c.x), parseInt((parseInt(this.PARENT.posY+size/2))*c.scale-c.y));
		ctx.rotate(this.PARENT.r*Math.PI/180);
		ctx.beginPath();
		ctx.arc(0,0,parseInt(size*c.scale), 0, 2 * Math.PI);
		ctx.fill();
		ctx.strokeStyle="#000";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(parseInt(size*c.scale*1.3), 0);
		ctx.stroke();
		//ctx.fillRect(-size/2*c.scale,-size/2*c.scale,size*c.scale,size*c.scale);
		ctx.restore();
	},
	read: function (packet){
		var d = packet[3];
		this.size = d[2];
		this.r = d[3];
		this.g = d[4];
		this.b = d[5];
		this.color = "rgb("+parseInt(this.r)+","+parseInt(this.g)+","+parseInt(this.b)+")";

	},
	send: function (users, io){
		var status = 5;
		if(this.status==0)  status = 4;
		//var packet = new Packet(new Date().getTime(),this.PARENT.id,status,[this.PARENT.id, this.name, this.size, this.r, this.g, this.b]);
		var packet = [new Date().getTime(),this.PARENT.id,status,[this.PARENT.id, this.name, parseInt(this.size),  parseInt(this.r),  parseInt(this.g),  parseInt(this.b)]];
		
		var json = JSON.stringify(packet);
		if(this.status==0) this.status =1;

		return json;//json;//json;//json;
	
	},
	sync: function (users, io){
		var packet = [new Date().getTime(),this.PARENT.id,4,[this.PARENT.id, this.name, parseInt(this.size),  parseInt(this.r),  parseInt(this.g),  parseInt(this.b)]];
		var json = JSON.stringify(packet);
		return json;
	}
});