var Blood = Component.extend({
	init: function (PARENT, dR){
		this.name = "Health";
		this.PARENT = PARENT;
		this.dR = dR;
		this.time = 10000;
		var size = 200;
		this.notAdded = true;
		this.list= new Array(size);
		this.listX = new Array(size);
		this.listY = new Array(size);
		this.listdR = new Array(size);
		this.listP = new Array(size);
		var graph = new PIXI.Graphics();
		
		graph.beginFill(0xFF3300);
		graph.drawRect(0,0,4,4);
		graph.endFill();
		graph.boundsPadding = 0;
		//this.texture = new PIXI.RenderTexture(gd.renderer,2, 2);
		this.listOBlood = new PIXI.ParticleContainer(size);
		this.listOBlood.roundPixelsboolean = true;
		
		for(var i =0;i<size;i++){
			this.list[i] = new PIXI.Sprite(graph.generateTexture());
			this.list[i].position.x = this.PARENT.posX;
			this.list[i].position.y = this.PARENT.posY;
			this.listdR[i] = 50*Math.random()-25;
			this.listP[i] = 20*Math.random()*Math.random();
			this.listOBlood.addChild(this.list[i]);
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

				this.list[i].position.x += dX*this.listP[i];
				this.list[i].position.y += dY*this.listP[i];
				this.listP[i] *= .86;
			}
			
		}
	},
	render: function (gd,screen){
		//if(1)return;
		if(this.time<0){
			gd.stage.removeChild(this.listOBlood);
			//this.listOBlood.destory();
			return;
		}
		var size = this.size;
		if(this.notAdded){
			gd.stage.addChild(this.listOBlood);
			this.notAdded = false;
		}
		var c = gd.camera;
		this.listOBlood.position.x = -c.x;
		this.listOBlood.position.y = -c.y;
		this.listOBlood.alpha = ((this.time/10000.0));
		
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
