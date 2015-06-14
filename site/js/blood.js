var Blood = Component.extend({
	init: function (PARENT, dR){
		this.name = "Health";
		this.PARENT = PARENT;
		this.dR = dR;
		this.time = 10000;
		var size = 22;
		this.listX = new Array(size);
		this.listY = new Array(size);
		this.listdR = new Array(size);
		this.listP = new Array(size);
		for(var i =0;i<this.listY.length;i++){
			this.listX[i] = this.PARENT.posX;
			this.listY[i] = this.PARENT.posY;
			this.listdR[i] = 30*Math.random()-15;
			this.listP[i] = 6*Math.random();
		}
		this.size = 5;

	},
	name: function (){
		return this.name;
	},
	update: function (gd, delta){
		if(gd.type == 0){//server 
			
		}
		else if(gd.type == 1){//client
			this.time -= delta;
			if(this.listP[0]<.05)return;
			//if(Math.random()<.03)gd.glitch = 1;

			for(var i =0;i<this.listY.length;i++){
				var dX = 5*Math.cos((this.listdR[i]+this.dR)*Math.PI/180);
				var dY = 5*Math.sin((this.listdR[i]+this.dR)*Math.PI/180);

				this.listX[i] += dX*this.listP[i];
				this.listY[i] += dY*this.listP[i];
				this.listP[i] *= .86;
			}
			
		}
	},
	render: function (gd,screen){
		if(this.time<0)return;
		var size = this.size;
		var ctx = screen.ctx;
		var c = gd.camera;
		//var p = 1.0*this.health/this.maxHealth;
		var n = parseInt(240.0*(1-(this.time/10000.0)));
		ctx.fillStyle="rgb(240,"+n+","+n+")";
		for(var i =0;i<this.listY.length;i++){
			ctx.fillRect(parseInt((parseInt(this.listX[i]-this.size/2))*c.scale-c.x), parseInt((parseInt(this.listY[i]-this.size/2))*c.scale-c.y+30),parseInt(size*c.scale),parseInt(size*c.scale));
		}
		//ctx.fillStyle="green";
		//ctx.fillRect((parseInt(this.PARENT.posX-20))*c.scale-c.x, (parseInt(this.PARENT.posY+size/2))*c.scale-c.y+30,p*size*c.scale,size*.2*c.scale);
		
	},
	read: function (packet){
		var d = packet[3];
		this.health = d[2];
		this.maxHealth = d[3];
		this.hitCount = d[4];
		this.hitX = d[5];
		this.hitY = d[6];
	},
	send: function (users, io){
		var status = 5;
		if(this.status==0)  status = 4;
		var packet = [new Date().getTime(),this.PARENT.id,status,[this.PARENT.id, this.name,this.health, this.maxHealth, this.hitCount, this.hitX, this.hitY]];
		var json = JSON.stringify(packet);
		if(this.status==0) this.status =1;
		return json;
	},
	sync: function (users, io){
		var packet = [new Date().getTime(),this.PARENT.id,4,[this.PARENT.id, this.name,this.health, this.maxHealth, this.hitCount, this.hitX, this.hitY]];
		var json = JSON.stringify(packet);
		return json;
	}
});
