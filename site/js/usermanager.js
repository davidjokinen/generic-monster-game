var UserManager = Class.extend({
	init: function (MAX_USERS){
		this.MAX_USERS = MAX_USERS || 64;
		this.users = new Array();
		//this.userConns = new Array();
		this.userID = -1;
		this.idCount = 0;
		this.view = 0;
		this.viewCount = 0;

		this.changed = 0;
	},
	name: function (){
		return this.name;
	},
	update: function (gd, delta){
		if(gd.type == 1){//
			if(this.viewCount > 0){
				this.viewCount -= delta;
			} else {
				var input = gd.input.state;
				if(input) {
					if(input.tab){
						if(this.view){
							this.view = 0;
						}else{
							this.view = 1;
						}
						this.viewCount = 300;
					}

				}
			}
		}
	},
	render: function (gd,screen){
		var ctx = screen.ctx;
		if(this.view == 0)return;
		ctx.fillStyle="#000";//silkscreennormal
		ctx.font = '20px silkscreennormal';
		ctx.fillText("Users: "+this.users.length,10,110);
		for(var i =0;i<this.users.length;i++){
			if(this.users[i].disconnect){
				this.remove(this.users[i]);
				i--;
				continue;
			}
			if(this.users[i].info.id!= this.userID)
				ctx.fillText(" "+this.users[i].info.name+"("+this.users[i].info.id+") Hunter Kills:"+this.users[i].info.hunterKills+" Monster Kills:"+this.users[i].info.monsterKills+" Deaths:"+this.users[i].info.deaths,10,130+20*i);
			else
				ctx.fillText("*"+this.users[i].info.name+"("+this.users[i].info.id+") Hunter Kills:"+this.users[i].info.hunterKills+" Monster Kills:"+this.users[i].info.monsterKills+" Deaths:"+this.users[i].info.deaths,10,130+20*i);
		}
		
	},
	add: function (socket){
		var newuser = new User(socket.sessionId);
		newuser.socket = socket;
		socket.info = newuser;
		this.users.push(socket);
		this.changed = 1;
	},
	remove: function (socket){
		var i = this.users.indexOf(socket);
		this.users.splice(i, 1);
		this.changed = 1;
	},
	getInput: function (id){
		id = id || this.userID;
		for(var i =0;i<this.users.length;i++){
			if(this.users[i].sessionId == id)
				return this.users[i].info.input;
		}
		return 0;
	},
	getUser: function (id){
		id = id || this.userID;
		for(var i =0;i<this.users.length;i++){
			if(this.users[i].sessionId == id)
				return this.users[i];
		}
		return 0;
	},
	get: function (socket, data){
		var i = this.users.indexOf(socket);
		var input = new InputState();
		input.read(data);
		this.users[i].info.input = input;
	},
	read: function (data){
		this.userID = data[0];
		this.MAX_USERS = data[1];
		this.users = new Array();//this.MAX_USERS

		var userJSON = data[2];
		for(var i =0;i<userJSON.length;i++){
			var u = userJSON[i];
			this.users[i] = {};
			this.users[i].sessionId = u[0];
			var user = new User(u[0]);
			user.read(u)
			this.users[i].info = user;
		}
	},
	send: function (users, io){
		if(this.changed==0){
			//return "";
		}
		var userJson ="[";
		for(var i =0;i<this.users.length;i++){
			if(i!=0)userJson +=",";
			userJson += this.users[i].info.send(users, io);
		}
		userJson +="]";
		//var packet = "["+this.users.length+","+this.MAX_USERS+","+userJson+"]";
		var userID = -1;
		//for(var i =0;i<users.length;i++){
			for(var q =0;q<this.users.length;q++){
				
				var packet = "["+this.users[q].sessionId+","+this.MAX_USERS+","+userJson+"]";
				//console.log("sending to user "+this.users[q].sessionId);
				this.users[q].emit('getUsers', packet);
			}
		
		this.changed=0;
		//	var packet = "["+userID+","+this.MAX_USERS+","+userJson+"]";
	//		users[i].emit('getUsers', packet);
		//}
		//var json = JSON.stringify(packet);

		//return packet;
	},
	sync: function (user){
		var userID = -1;
		var userJson ="[";
		for(var i =0;i<this.users.length;i++){
			if(i!=0)userJson +=",";
			userJson += this.users[i].info.sync(user);

		}
		userJson +="]";
		//for(var i =0;i<users.length;i++){
			
			var packet = "["+user.sessionId+","+this.MAX_USERS+","+userJson+"]";
			user.emit('syncUsers', packet);
		//}
		//var json = JSON.stringify(packet);
		//return packet;
	}
});