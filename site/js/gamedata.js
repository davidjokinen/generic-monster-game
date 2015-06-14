var GameData = Class.extend({
	init: function (TYPE){
		this.entities = new Array();
		this.localEntities = new Array();
		this.userManager;
		this.camera = new Camera();
		this.glitch = 0;
		this.input;
		this.screen;
		this.map = new MyMap();

		this.rayVsCircle;
		this.boxIntersect;
		this.Line ;

		this.type = TYPE; 
		this.startTime; 
		this.time = 0;
		this.serverTime = 0; 
		this.serverDelta = 0; 
		this.fakeLag = 60;

		this.idCount = 0;

		this.store = new Array();
		this.testCount = 0;

		this.dataSize =0;
		
	},
	update: function (){
		
		this.time = new Date().getTime();
		
		for(var i =0;i<this.store.length;){
			//console.log((this.store[i].time-this.time+this.fakeLag+this.serverDelta)+"  "+this.store.length);
			//if(this.store[i].time-this.time+this.fakeLag+this.serverDelta > 0)break;
			//console.log("What:" + packet.status);
			//console.log("" + packet.status);
			if(this.fakeLag-(this.time-this.store[i][0]+this.serverDelta) > 0)break;
			if(this.store[i][2] == 0){
				var data = this.store[i][3];
				var e = new Entity(data[0],data[1],data[2],data[3]);
				e.last = this.store[i];
				this.entities.push(e);

				//console.log("adding");

			}else if(this.store[i][2] == 2){
				var id = this.store[i][1];
				for(var z =0;z<this.entities.length;z++){
					if(this.entities[z].id == id){
						//this.entities[z].dying(this);
						//console.log("dying");
						//this.entities.splice(z,1);
						
						break;
					}
				}
				//console.log("removing");
				
			}else if(this.store[i][2] >= 4){
				for(var z =0;z<this.entities.length;z++){
					if(this.entities[z].id == this.store[i][1]){
						this.entities[z].push(this.store[i]);
						break;
					}
				}
				//continue;
				//console.log("status error:" + this.store[i].status);
			}

			this.store.splice(i,1);
		}
	},
	clear: function (){	
		this.entities = new Array();
		this.store = new Array();
		
	},
	get: function (packet){
		//if((this.testCount++)%60==0)
		//console.log(this.store.length);
		this.startTime = this.startTime || new Date().getTime();
		this.serverTime = packet[0];
		this.serverDelta = (packet[0] - new Date().getTime() );

		if(packet[2] == 0){//Add
			this.store.push(packet);
		}else if(packet[2] == 1){//Edit
			for(var i =0;i<this.entities.length;i++){
				if(this.entities[i].id == packet[1]){
					this.entities[i].push(packet);
					break;
				}
			}
			
		}else if(packet[2] == 2){//Remove
			for(var i =0;i<this.entities.length;i++){
				if(this.entities[i].id == packet[1]){
					this.entities[i].push(packet);
					break;
				}
			}
			//this.store.push(packet);
		}		
		else if(packet[2] == 4){
			this.store.push(packet);
		}
		else if(packet[2] == 5){
			this.store.push(packet);
		}

		if(!document.hasFocus()){
			this.update();
		}
		
	},
	send: function (users, io){
		var send = '[';
		for(var i =0;i<this.entities.length;i++){
			var JSON = this.entities[i].send(users, io);
			if(JSON != ""){
				if(i!=0) send += ',';
				send += JSON;
			}
			
		}
		send += ']';
		
		io.emit('get', send);
		this.userManager.send(users, io);

	},
	sync: function (user){
		var send = '[';
		for(var i =0;i<this.entities.length;i++){
			if(i!=0) send += ',';
			send += this.entities[i].sync(user);
		}
		send += ']';
		user.emit('sync', send);
		this.userManager.sync(user);
	}

})