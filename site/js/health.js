var Health = Component.extend({
	init: function (PARENT, CURHEALTH, MAX){
		this.name = "Health";
		this.PARENT = PARENT ;
		this.health = CURHEALTH|| 100;
		this.maxHealth = MAX || 100;
		this.stamina = CURHEALTH|| 100;
		this.maxStamina = MAX || 100;
		this.oldHitCount = 0;
		this.damaged = 0;
		this.damagedCount = 0;
		this.damagedCountMax = 300;
		this.hitCount = 0;
		this.hitR = -1;
		this.hitBy;
		this.size = 60;
		this.status = 0;
	},
	name: function (){
		return this.name;
	},
	dying: function(gd){
		if(gd.type == 0){//
			
		}
		if(gd.type == 1){//
			var e = new Entity(-1,this.PARENT.posX,this.PARENT.posY,0);
			e.add(new Blood(e,this.hitR+90*Math.random()-45));
			gd.localEntities.push(e);
			e = new Entity(-1,this.PARENT.posX,this.PARENT.posY,0);
			e.add(new Blood(e,this.hitR+90*Math.random()-45));
			gd.localEntities.push(e);
			e = new Entity(-1,this.PARENT.posX,this.PARENT.posY,0);
			e.add(new Blood(e,this.hitR+90*Math.random()-45));
			gd.localEntities.push(e);
		}
	},
	update: function (gd, delta){
		if(gd.type == 0){//server 
			if(this.health <= 0)
				this.PARENT.status = 2;
			//if(this.PARENT.posX < -300)this.health--;
			//if(this.PARENT.posY < -300)this.health--;
			//if(this.PARENT.posY > 2400)this.health--;
			//if(this.PARENT.posX > 3300)this.health--;
			if(this.stamina < this.maxStamina)this.stamina++;
		}
		else if(gd.type == 1){//client
			if(this.damagedCount > 0){
				this.damagedCount -= delta;
				this.damaged = 1;
			}else{
				this.damaged = 0;
			}
			
			if(this.oldHitCount != this.hitCount){
				var e = new Entity(-1,this.PARENT.posX,this.PARENT.posY,0);
				e.add(new Blood(e,this.hitR));
				gd.localEntities.push(e);
				this.damagedCount = this.damagedCountMax;
				this.damaged = 1;
				this.oldHitCount = this.hitCount;
			}
		}
	},
	render: function (gd,screen){
		var size = this.size;
		var ctx = screen.ctx;
		var c = gd.camera;
		var p = 1.0*this.health/this.maxHealth;
		var p2 = 1.0*this.stamina/this.maxStamina;
		if(p>1||p<0)return;
		if(p2>1||p2<0)return;
		var com = this.PARENT.get("DefaultHuman");

		if(com && com.ID == gd.userManager.userID){
			var user1 = gd.userManager.getUser();
			var graphics = gd.graphics;
			
			//graphics.clear();
			//ctx.fillStyle="rgb(240,"+n+","+n+")";
			graphics.beginFill(0xCCCCCC);
			//graphics

			graphics.drawRect(parseInt(40*gd.camera.scale), parseInt(10*gd.camera.scale),parseInt(300*gd.camera.scale),parseInt(10*gd.camera.scale));
			graphics.beginFill(0xFF8888);
			graphics.drawRect(parseInt(40*gd.camera.scale), parseInt(8*gd.camera.scale),parseInt(p*300*gd.camera.scale),parseInt(14*gd.camera.scale));

			graphics.beginFill(0xCCCCCC);
			graphics.drawRect(parseInt(20*gd.camera.scale), parseInt(30*gd.camera.scale),parseInt(200*gd.camera.scale),parseInt(10*gd.camera.scale));
			graphics.beginFill(0x88FF88);
			graphics.drawRect(parseInt(20*gd.camera.scale), parseInt(28*gd.camera.scale),parseInt(p2*200*gd.camera.scale),parseInt(14*gd.camera.scale));
			
			
			
		} else {
			//ctx.fillStyle="red";
			//ctx.fillRect((parseInt(this.PARENT.posX-20))*c.scale-c.x, (parseInt(this.PARENT.posY+size/2))*c.scale-c.y+30,size*c.scale,size*.2*c.scale);
			///ctx.fillStyle="green";
			//ctx.fillRect((parseInt(this.PARENT.posX-20))*c.scale-c.x, (parseInt(this.PARENT.posY+size/2))*c.scale-c.y+30,p*size*c.scale,size*.2*c.scale);
		}
		
		
	},
	read: function (packet){
		var d = packet[3];
		this.health = d[2];
		this.maxHealth = d[3];
		this.hitCount = d[4];
		this.hitR = d[5];
		this.stamina = d[6];
		this.maxStamina = d[7];
	},
	send: function (users, io){
		var status = 5;
		if(this.status==0)  status = 4;
		var packet = [new Date().getTime(),this.PARENT.id,status,[this.PARENT.id, this.name,this.health, this.maxHealth, this.hitCount, this.hitR, this.stamina, this.maxStamina]];
		var json = JSON.stringify(packet);
		if(this.status==0) this.status =1;
		return json;
	},
	sync: function (users, io){
		var packet = [new Date().getTime(),this.PARENT.id,4,[this.PARENT.id, this.name,this.health, this.maxHealth, this.hitCount, this.hitR, this.stamina, this.maxStamina]];
		var json = JSON.stringify(packet);
		return json;
	}
});
