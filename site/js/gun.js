var Gun = Item.extend({
	init: function (PARENT){
		this.name = "Gun";
		this.PARENT = PARENT;
		
		this.title = "Default Gun";

		this.clipMax = 40;
		this.clip = 40;
		this.ammo = 12000;
		this.ammoMax = 12000;

		this.shots = 1;
		this.spread = 3;
		this.distance = 1000;
		this.distanceSpread = 100;
		this.damage = 30;

		this.shotTime = 50;
		this.reloadTime = 2000;

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

			var bx1 = x1;
			var bx2 = x2;

			var by1 = y1;
			var by2 = y2;
			var temp;
			if(bx1 > bx2){
				temp = bx1;
				bx1 = bx2;
				bx2 = temp;
			}
			if(by1 > by2){
				temp = by1;
				by1 = by2;
				by2 = temp;
			}

			var boxes = gd.map.getBoxes(1);
			var dont = boxes.length;
			
			boxes.push([bx1,by1,bx2,by2]);
			
			var result = gd.boxIntersect(boxes);
			if(result.length==0){
				

			} else {
				boxes = gd.map.getBoxes(1);
				//console.log("BoxList:"+gd.map.getBoxes(1).length);
				var bLine = new gd.Line(x1, y1, x2, y2);
				var closest;
				//The bullet could have hit a wall
				for(var i =0;i<result.length;i++){
					//console.log(result);
					var num1 = result[i][0];
					var num2 = result[i][1];
					if(num1 == dont)
						num1 = num2;
					var box = boxes[num1];
					

					var r = bLine.intersectSegment(box[0], box[1], box[2], box[1]);
					if(r){
						if(closest){
							var d1 = (closest.x-x1)*(closest.x-x1)+(closest.y-y1)*(closest.y-y1);
							var d2 = (r.x-x1)*(r.x-x1)+(r.y-y1)*(r.y-y1);
							if(d2<d1)
								closest = r;
						}else
						closest = r;
					}
					r = bLine.intersectSegment(box[0], box[3], box[2], box[3]);
					if(r){
						if(closest){
							var d1 = (closest.x-x1)*(closest.x-x1)+(closest.y-y1)*(closest.y-y1);
							var d2 = (r.x-x1)*(r.x-x1)+(r.y-y1)*(r.y-y1);
							if(d2<d1)
								closest = r;
						}else
						closest = r;
					}
					r = bLine.intersectSegment(box[0], box[1], box[0], box[3]);
					if(r){
						if(closest){
							var d1 = (closest.x-x1)*(closest.x-x1)+(closest.y-y1)*(closest.y-y1);
							var d2 = (r.x-x1)*(r.x-x1)+(r.y-y1)*(r.y-y1);
							if(d2<d1)
								closest = r;
						}else
						closest = r;
					}
					r = bLine.intersectSegment(box[2], box[1], box[2], box[3]);
					if(r){
						if(closest){
							var d1 = (closest.x-x1)*(closest.x-x1)+(closest.y-y1)*(closest.y-y1);
							var d2 = (r.x-x1)*(r.x-x1)+(r.y-y1)*(r.y-y1);
							if(d2<d1)
								closest = r;
						}else
						closest = r;
					}

					
					
				}
				if(closest){
						//console.log(r);
						x2 = closest.x;
						y2 = closest.y;
					}
				
				
			}


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
	//	var ctx = screen.ctx;
		var c = gd.camera;
		//if(1)return;
		if(this.timer>100){
			var p = (.9999*this.timer/this.timerStart);
			var graphics = gd.graphics;
			graphics.fillStyle="#CCCCCC";
			graphics.beginFill(0xCCCCCC);

			graphics.arc((this.PARENT.posX+10)*c.scale-c.x, (parseInt(this.PARENT.posY+10))*c.scale-c.y,50,0,Math.PI*2*p-.05, false); // outer (filled)
			graphics.arc((this.PARENT.posX+10)*c.scale-c.x, (parseInt(this.PARENT.posY+10))*c.scale-c.y,32,Math.PI*2*p,Math.PI*2, true); // inner (unfills it)
			graphics.endFill();
		}
		var com = this.PARENT.get("DefaultHuman");
		if(com) 
		if(com.ID == gd.userManager.userID){
			//ctx.fillStyle="#000000";
			//ctx.font =  ;//silkscreennormal';
			if(this.basicText1 == [][0]){
				this.basicText1 = new PIXI.Text(this.title,{font: parseInt(20*gd.camera.scale)+'px code_pro_demoregular'});
				gd.stage.addChild(this.basicText1);
			}
			if(this.basicText2 == [][0]){
				this.basicText2 = new PIXI.Text(this.clip+" : "+this.ammo,{font: parseInt(20*gd.camera.scale)+'px code_pro_demoregular'});
				gd.stage.addChild(this.basicText2);
			}
			this.basicText1.text = this.title;
			this.basicText1.x = gd.renderer.width-parseInt(200*gd.camera.scale);
			this.basicText1.y = gd.renderer.height-parseInt(50*gd.camera.scale);

			this.basicText2.text = this.clip+" : "+this.ammo;
			this.basicText2.x = gd.renderer.width-parseInt(200*gd.camera.scale);
			this.basicText2.y = gd.renderer.height-parseInt(30*gd.camera.scale);
			
			
			//ctx.fillText(this.title,,);
			//ctx.fillText(this.clip+" : "+this.ammo,,);
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
		var packet = [new Date().getTime(),this.PARENT.id,status,[this.PARENT.id, this.name,this.itemID, parseInt(this.clipMax),  parseInt(this.clip) ,  parseInt(this.ammo),  parseInt(this.ammoMax), parseInt(this.timer), parseInt(this.timerStart)]];
		
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
