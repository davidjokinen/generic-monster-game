var Bullet = Component.extend({
	init: function (PARENT, X1,Y1,X2,Y2){
		this.name = "Bullet";
		this.PARENT = PARENT;
		this.x1 = X1;
		this.y1 = Y1;
		this.x2 = X2;
		this.y2 = Y2;

		this.status = 0;
		
		this.timerMax = 1000;
		this.timer = this.timerMax;
		this.count = 0;

	},
	name: function (){
		return this.name;
	},
	update: function (gd, delta){
		if(gd.type == 0){//
			this.count++;
			if(this.count>3)
			this.PARENT.updateJSON =0;
			if(this.timer > 0){
				this.timer -= delta;
			}
			else{
				this.PARENT.status = 2;
	
			}
			
		
		}
		else if(gd.type == 1){//
			this.timer -= delta;
		}
	},
	render: function (gd,screen){
		
		var ctx = screen.ctx;
		var c = gd.camera;
		var color = parseInt(180+50*(1-(1.0*this.timer/this.timerMax)));
		ctx.strokeStyle="rgb("+color+","+color+","+240+")";
		ctx.beginPath();
		ctx.moveTo(parseInt(this.x1*c.scale-c.x), parseInt(this.y1*c.scale-c.y));
		ctx.lineTo(parseInt(this.x2*c.scale-c.x), parseInt(this.y2*c.scale-c.y));
		ctx.stroke();
	},
	read: function (packet){
		var d = packet[3];
		this.x1 = d[2];
		this.y1 = d[3];
		this.x2 = d[4];
		this.y2 = d[5];

	},
	send: function (users, io){
		var status = 5;
		if(this.status==0)  status = 4;
		//var packet = new Packet(new Date().getTime(),this.PARENT.id,status,[this.PARENT.id, this.name, this.size, this.r, this.g, this.b]);
		var packet = [new Date().getTime(),this.PARENT.id,status,[this.PARENT.id, this.name,this.x1,this.y1,this.x2,this.y2]];
		
		var json = JSON.stringify(packet);
		if(this.status==0) {
			this.status =1;
			return json;
		}
		if(this.status==2) {
			return json;
		}
		return "";
		
	
	},
	sync: function (users, io){
		var packet = [new Date().getTime(),this.PARENT.id,4,[this.PARENT.id, this.name,this.x1,this.y1,this.x2,this.y2]];
		var json = JSON.stringify(packet);
		return json;
	}
});
