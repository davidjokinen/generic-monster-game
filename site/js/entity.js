var Entity = Class.extend({
	init: function (ID,X,Y,R){
		this.posX = X;
		this.posY = Y;
		this.r = R;
		
		this.velX = 600*Math.random()-300;
		this.velY = 600*Math.random()-300;
		this.velR = 600*Math.random()-300;

		this.id = ID;

		this.components = new Array();

		this.status = 0;
		this.store = new Array();
		this.storeComponents = new Array();
		this.last;
		this.updateJSON = 1;
	},
	get: function(name){
		for(var i =0;i<this.components.length;i++){
			if(name == this.components[i].name){
				return this.components[i];
			}
		}
	},
	add: function (com) {
		this.remove(com.name);
		//for(var i =0;i<this.components.length;i++){
		//	if(this.components[i] instanceof ControllerComponent)
		//		if(this.components[i].add(com))
		//			return;
		//}
		this.components.push(com);
	},
	getBoxes: function(point){
		return [this.posX,this.posY,this.posX+20,this.posY+20];
	},
	remove: function (comName) {
		var name = comName;
		//for(var i =0;i<this.components.length;i++){
		//	if(this.components[i] instanceof ControllerComponent)
		//		if(this.components[i].remove(com))
		//			return;
		//}
		for(var i =0;i<this.components.length;i++){
			if(name == this.components[i].name){
				this.components.splice(i,1);
			}
		}
		
	},
	dying: function(gd){
		for(var i =0;i<this.components.length;i++){
			this.components[i].dying(gd);
		}
	},
	update: function (gd, delta) {
		//update.base.call(gamedata, delta);
		
		if(gd.type == 0){//
			var boxes = gd.map.getBoxes(1);
			var nx = this.velX * delta / 1000.0;
			var ny = this.velY * delta / 1000.0;
			var l = boxes.length;
			//boxes.push([this.posX+nx,this.posY,this.posX+40+nx,this.posY+40]);
			//boxes.push([this.posX,this.posY+ny,this.posX+40,this.posY+40+ny]);
			boxes.push([this.posX+nx,this.posY+ny,this.posX+20+nx,this.posY+20+ny]);
			var count = 0;
			var result = gd.boxIntersect(boxes);
			if(result==0){
				this.posX += this.velX * delta / 1000.0;
				this.posY += this.velY * delta / 1000.0;
				this.r += this.velR * delta / 1000.0;

			} else {
				
					this.velX = (-this.velX);
			  		this.velY = (-this.velY);
				
				this.posX += this.velX * delta / 1000.0;
				this.posY += this.velY * delta / 1000.0;
				this.r += this.velR * delta / 1000.0;
			}


			
			
		} else{//client
			var time = new Date().getTime();
			for(var i =0;i<this.store.length;){
				//console.log((gd.fakeLag-(time-this.store[i].time+gd.serverDelta) ));
				if(gd.fakeLag-(time-this.store[i][0]+gd.serverDelta) > 0){

					//var t1 = -time-gd.fakeLag+gd.serverDelta;
					//var t2 = -time-gd.fakeLag+gd.serverDelta;
					//if(!this.last) this.last = this.store[i];
					var p = ((gd.fakeLag-(time-this.store[i][0]+gd.serverDelta)))/20.0;
					
					var pi = 1-p;
					//console.log(pi);
					var dX = this.store[i][3][1] - this.last[3][1];
					var dY = this.store[i][3][2] - this.last[3][2];
					var dR = this.store[i][3][3] - this.last[3][3];
					if(pi >1 ){
						this.last = this.store[i];
						this.posX = this.store[i][3][1];
						this.posY = this.store[i][3][2];
						this.r = this.store[i][3][3];
						this.status = this.store[i][2];
						this.store.splice(i,1);
						continue;
					}
					if(pi <0 )pi=0;  
					this.posX =  this.last[3][1] + dX*pi;
					this.posY = this.last[3][2] + dY*pi;
					this.r = (this.last[3][3] )%360;
					this.status = this.store[i][2];
					break;
				}
				this.last = this.store[i];
				this.posX = this.store[i][3][1];
				this.posY = this.store[i][3][2];
				this.r = this.store[i][3][3];
				this.status = this.store[i][2];
				this.store.splice(i,1);
			}
			for(var i =0;i<this.storeComponents.length;){
				//console.log((gd.fakeLag-(time-this.store[i].time+gd.serverDelta) ));
				if(gd.fakeLag-(time-this.storeComponents[i][0]+gd.serverDelta) > 0)break;

				var comName = this.storeComponents[i][3][1];
				var type = this.storeComponents[i][2];
				if(type == 4 || type == 7){
					var com = new window[comName](this);
					this.add(com);
					com.read(this.storeComponents[i])

				} else if(type == 5){
					for(var q =0;q<this.components.length;q++){
						if(comName == this.components[q].name){
							this.components[q].read(this.storeComponents[i]);
						}
					}

				} else if(type == 8){
					
					for(var q =0;q<this.components.length;q++){
						if(this.components[q] instanceof ControllerComponent)
							if(this.components[q].read(this.storeComponents[i]))
								break;
					}

				} else if(type == 6|| type == 9){
					
					this.remove(comName);
				}

				this.storeComponents.splice(i,1);
			}
			
		}

		for(var i =0;i<this.components.length;i++){
			this.components[i].update(gd, delta);
		}

	},
	render: function (gd,screen) {
		
		for(var i =0;i<this.components.length;i++){
			this.components[i].render(gd,screen);
		}
	},
	push: function (packet) {
		if(packet[2] <= 3)
			this.store.push(packet);
		else
			this.storeComponents.push(packet);
	},
	send: function (users, io){
		//var packet = new Packet(new Date().getTime(),this.id,this.status,[this.id,this.posX,this.posY,this.r]);
		var packet = [new Date().getTime(),this.id,this.status,[this.id,parseInt(this.posX),parseInt(this.posY),parseInt(this.r)]];
		
		var json = JSON.stringify(packet);
		//io.emit('get', json);
		for(var i =0;i<this.components.length;i++){
			var addjson = this.components[i].send(users, io);
			if(addjson != ""){
				json += ",";
				json += addjson;
			
			}
		}
		if(this.status==0) this.status=1;
		if(this.updateJSON==0 && this.status==1)
			return "";
		return json; 
			
	},
	sync: function (users, io){
		//var packet = new Packet(new Date().getTime(),this.id,0,[this.id,this.posX,this.posY,this.r]);
		var packet = [new Date().getTime(),this.id,0,[this.id,parseInt(this.posX),parseInt(this.posY),parseInt(this.r)]];
		var json = JSON.stringify(packet);
		var count = 0;
		for(var i =0;i<this.components.length;i++){
			var addjson = this.components[i].sync(users, io);
			if(addjson != ""){
				json += ",";
				json += addjson;
				count++;
			}
		}
		
		return json;
	}
});