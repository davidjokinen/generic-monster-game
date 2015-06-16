var DefaultHuman = Component.extend({
	init: function (PARENT, ID){
		this.name = "DefaultHuman";
		this.PARENT = PARENT;
		this.ID = ID;
		this.size = 20;
		this.r = 250;
		this.g = 200;
		this.b = 150;
		this.color = "red";
		this.t = 0;
		this.status = 0;
		this.count = 0;
		this.trail = new Array(60);
		this.activeTrail = 0;
		this.PARENT.velX =0;
		this.PARENT.velY =0;
		this.PARENT.velR =0;
		this.moving = 0;
	},
	name: function (){
		return this.name;
	},
	dying: function(gd){
		if(gd.type == 0){//
			var user1 = gd.userManager.getUser(this.ID);
			var XP = 0;
			if(user1){
				user1.info.deaths++;
				XP =user1.info.xp;
				user1.info.xp = 0;
			}
			
			
			var ent = this.PARENT.get("Health").hitBy;
			if(ent){
				var hum = ent.get("DefaultHuman");
				if(hum){
					var user2 = gd.userManager.getUser(hum.ID);
					if(user2){
						user2.info.hunterKills++;
						user2.info.xp += XP;
					}
					
				}
				
			}
			
			
			var e = new Entity(gd.idCount++,Math.random()*400,Math.random()*400,0);
		    e.add(new Respawn(e,this.ID));
			if(user1){
		    gd.entities.push(e);
			}
			console.log('Player '+this.ID+' has died');
		}
		
	},
	
	update: function (gd, delta){
		if(gd.type == 0){//
			
		//	if(this.PARENT.posX<0||this.PARENT.posX>1000)
		//		this.PARENT.velX = -this.PARENT.velX;
		//	if(this.PARENT.posY<0||this.PARENT.posY>700)
		//		this.PARENT.velY = -this.PARENT.velY;
		if(this.moving ==0){
			this.PARENT.velX *= .13;
			this.PARENT.velY *= .13;
		}
			else{
			this.PARENT.velX *= .62;
			this.PARENT.velY *= .62;
		}
			//this.PARENT.r = (this.PARENT.r+360)%360;
			//this.r = 150+100*Math.random();
			//this.g = 150+100*Math.random();
			//this.b = 150+100*Math.random();
			var input = gd.userManager.getInput(this.ID);
			var user = gd.userManager.getUser(this.ID);
			var health = this.PARENT.get("Health");
			this.moving = 0;
			if(input){
				if(health && health.stamina > 3 && input.shift){
					if(input.up)this.PARENT.velY -= 500;
					if(input.down)this.PARENT.velY += 500;
					if(input.right)this.PARENT.velX += 500;
					if(input.left)this.PARENT.velX -= 500;
					health.stamina-=3;
				} else {
					if(input.up)this.PARENT.velY -= 400;
					if(input.down)this.PARENT.velY += 400;
					if(input.right)this.PARENT.velX += 400;
					if(input.left)this.PARENT.velX -= 400;
				}
				if(input.up + input.down + input.right + input.left > 1){
					this.PARENT.velY /= 1.214213562;
					this.PARENT.velX /= 1.214213562;
				}
					
				
				if(input.up || input.down || input.right || input.left) this.moving = 1;
				this.PARENT.r = input.r;
			}else{
				console.log('user has no input: '+this.ID);
			}

			
			if(user.disconnect == 1 || user==0){
				this.PARENT.status = 2;
				console.log('removing user');
			}
			if(Math.random() < .003){
				//this.PARENT.status = 2;
				//console.log(1);
			}
		}
		else if(gd.type == 1){//
			if(this.ID == gd.userManager.userID)
				gd.camera.focus = this.PARENT;
			//
			this.count+=delta;
			if(this.count >20){
				this.count = 0;
				this.trail[this.activeTrail*2] = this.PARENT.posX;
				this.trail[this.activeTrail*2+1] = this.PARENT.posY;
				this.activeTrail++;
				if(this.activeTrail==this.trail.length/2)this.activeTrail=0;
			}
		}
	},
	render: function (gd,screen){
		
		var graphics = gd.graphics;
			var c = gd.camera;
		
		graphics.beginFill(0x88FF88);
		graphics.drawRect(this.PARENT.posX-c.x-10, this.PARENT.posY-c.y-10,40,40);
		
		if(1)return;
		var size = this.size;
		var ctx = screen.ctx;
		var c = gd.camera;
		ctx.strokeStyle="#DDF";
		//ctx.beginPath();
		var len = this.trail.length/2;
		for(var i =0;i<len;i++){
		  //  if(i==0)ctx.moveTo((this.trail[(this.activeTrail+i)%len*2]+size/2)*c.scale-c.x, (this.trail[(this.activeTrail+i)%len*2+1]+size/2)*c.scale-c.y);
		   // else ctx.lineTo((this.trail[(this.activeTrail+i)%len*2]+size/2)*c.scale-c.x, (this.trail[(this.activeTrail+i)%len*2+1]+size/2)*c.scale-c.y);
		}
		//ctx.stroke();
		ctx.fillStyle=this.color;
		ctx.save();
		ctx.translate(parseInt((this.PARENT.posX+size/2)*c.scale-c.x), parseInt((this.PARENT.posY+size/2)*c.scale-c.y));
		//ctx.translate((parseInt(this.PARENT.posX+size/2))*c.scale-c.x, (parseInt(this.PARENT.posY+size/2))*c.scale-c.y);
		ctx.rotate(this.PARENT.r*Math.PI/180);
		ctx.beginPath();
		ctx.arc(0,0,size*c.scale, 0, 2 * Math.PI);
		ctx.fill();
		ctx.strokeStyle="#000";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(size*c.scale*1.3, 0);
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

		return json;//json;//json;//json;
	
	},
	sync: function (users, io){
		var packet = [new Date().getTime(),this.PARENT.id,4,[this.PARENT.id, this.name, parseInt(this.size),  parseInt(this.r),  parseInt(this.g),  parseInt(this.b),this.ID]];
		var json = JSON.stringify(packet);
		return json;
	}
});