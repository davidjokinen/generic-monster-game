var Spawner = Item.extend({
	init: function (PARENT){
		this.name = "Spawner";
		this.PARENT = PARENT;
		
		this.title = "Default Spawner";

		this.clipMax = 1;
		this.clip = 1;
		this.ammo = 8;
		this.ammoMax = 8;

		this.spawn = ["DefaultAI"];

		this.shotTime = 50;
		this.reloadTime = 500;

		this.timer = 0;
		this.timerStart = 0;

		this.ID = -1;
		this.status = 0;
	},
	name: function (){
		return this.name;
	},
	action1: function (gd,screen){
		if(this.timer > 0)return;
		this.clip--;
		for(var q=0;q<this.shots;q++){
			var e = new Entity(gd.idCount++,this.PARENT.posX,this.PARENT.posY,0);

			var rspread = this.spread*Math.random()-this.spread/2;
			var rdistance = this.distanceSpread*Math.random();

			var x1 = this.PARENT.posX+10+30*Math.cos((this.PARENT.r)*Math.PI/180);
			var y1 = this.PARENT.posY+10+30*Math.sin((this.PARENT.r)*Math.PI/180);

			var x2 = x1+(this.distance+rdistance)*Math.cos((this.PARENT.r+rspread)*Math.PI/180);
			var y2 = y1+(this.distance+rdistance)*Math.sin((this.PARENT.r+rspread)*Math.PI/180);

			e.add(new Bullet(e,x1,y1,x2,y2));
			gd.entities.push(e);

			this.timer = this.shotTime;
			this.timerStart = this.shotTime;

			var ray = {
			  start: {x: x1, y: y1},
			  end: {x: x2, y: y2}
			};

			var circle = {
			  position: {x: 50, y: 50},
			  radius: 5
			};
			for(var i =0;i<gd.entities.length;i++){
				if(gd.entities[i] === this.PARENT) continue;
				var health = gd.entities[i].get("Health");
				if(health){
					circle.position.x = gd.entities[i].posX+10;
					circle.position.y = gd.entities[i].posY+10;
					circle.radius = 20;
					var point = gd.rayVsCircle(ray, circle);
					if(point){
						health.health -= this.damage;
						health.hitCount++;
						health.hitR = this.PARENT.r;
						health.hitBy = this.PARENT;
					}
				}
				
			}
		}
		if(this.clip==0){
			if(this.ammo>0){
				this.timer = this.reloadTime;
				this.timerStart = this.reloadTime;
				if(this.ammo > this.clipMax){
					this.ammo -= this.clipMax;
					this.clip = this.clipMax;
				}else{
					this.clip = this.ammo;
					this.ammo = 0;
				}
			}
			
		}
	},
	action2: function (gd,screen){
		
	},
	update: function (gd, delta){
		if(gd.type == 0){//
			if(this.ID == -1) {
				var com = this.PARENT.get("DefaultHuman");
				if(com) this.ID = com.ID;
			}
			if(this.timer > 0){
				this.timer -= delta;
				
			}
			else{
				var input = gd.userManager.getInput(this.ID);
				if(input){
					if(input.reload){
						//console.log('reloading');
						if(this.ammo>0){
							this.timer = this.reloadTime;
							this.timerStart = this.reloadTime;
							var clipDelta = this.clipMax - this.clip;
							if(this.ammo > clipDelta){
								this.ammo -= clipDelta;
								this.clip += clipDelta;
							}else{
								this.clip = this.ammo;
								this.ammo = 0;
							}
						}

					}
					
				}
	
			}
			
		
		}
		else if(gd.type == 1){//
			
		}
	},
	render: function (gd,screen){
		var size = this.size;
		var ctx = screen.ctx;
		var c = gd.camera;
		
		if(this.timer>100){
			var p = (.9999*this.timer/this.timerStart);
			ctx.fillStyle="#CCC";
			ctx.beginPath()
			ctx.arc((parseInt(this.PARENT.posX+10))*c.scale-c.x, (parseInt(this.PARENT.posY+10))*c.scale-c.y,50,0,Math.PI*2*p, false); // outer (filled)
			ctx.arc((parseInt(this.PARENT.posX+10))*c.scale-c.x, (parseInt(this.PARENT.posY+10))*c.scale-c.y,32,Math.PI*2*p,Math.PI*2, true); // inner (unfills it)
			ctx.fill();
		}
		var com = this.PARENT.get("DefaultHuman");
		if(com) 
		if(com.ID == gd.userManager.userID){
			ctx.fillStyle="#000";
			ctx.font = '20px code_pro_demoregular';//silkscreennormal';
			ctx.fillText(this.title,ctx.width-200,ctx.height-50);
			ctx.fillText(this.clip+" : "+this.ammo,ctx.width-200,ctx.height-30);
		}
	},
	read: function (packet){
		var d = packet[3];
		this.itemID = d[2];
		this.clipMax = d[3];
		this.clip = d[4];
		this.ammo = d[5];
		this.ammoMax = d[6];
		this.timer = d[7];
		this.timerStart = d[8];

	},
	send: function (users, io){
		var status = 5;
		if(this.status==0)  status = 4;
		//var packet = new Packet(new Date().getTime(),this.PARENT.id,status,[this.PARENT.id, this.name, this.size, this.r, this.g, this.b]);
		var packet = [new Date().getTime(),this.PARENT.id,status,[this.PARENT.id, this.name,this.itemID, this.clipMax,  this.clip ,  this.ammo,  this.ammoMax, this.timer, this.timerStart ]];
		
		var json = JSON.stringify(packet);
		if(this.status==0) this.status =1;

		return json;
	
	},
	sync: function (users, io){
		var packet = [new Date().getTime(),this.PARENT.id,4,[this.PARENT.id, this.name,this.itemID,this.clipMax,  this.clip ,  this.ammo,  this.ammoMax, this.timer, this.timerStart ]];
		var json = JSON.stringify(packet);
		return json;
	}
});
