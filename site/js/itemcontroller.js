var ItemController = Component.extend({
	init: function (PARENT){
		this.name = "ItemController";
		this.PARENT = PARENT;		
		
		this.list = new Array();
		this.active = 0;

		this.ID = -1;

		this.itemIDNEW = 1;
		this.itemID = this.itemIDNEW++;

		this.count = 0;

		this.status = 0;
	},
	name: function (){
		return this.name;
	},
	update: function (gd, delta){
		if(gd.type == 0){//
			if(this.ID == -1) {
				var com = this.PARENT.get("DefaultHuman");
				if(com) this.ID = com.ID;
			}

			if(this.count>0){
				this.count -= delta;
				return;
			}
			if(this.list.length == 0)return;
			this.list[this.active].update(gd, delta);

			var input = gd.userManager.getInput(this.ID);
			if(input){
				if(input.interact){
					this.active = (this.active+1)%this.list.length;
					this.count = 300;
				}
				if(input.action1){
					this.list[this.active].action1(gd, delta);
				}
				if(input.action2){
					this.list[this.active].action2(gd, delta);
				}
			}

		
		}
		else if(gd.type == 1){//
			
		}
	},
	add:  function (add){
		if(add instanceof Item){
			add.itemID = this.itemIDNEW++;
			this.list.push(add);
			return true;
		}
		return false;	

	},
	getByID:  function (ID){
		for(var i =0;i<this.list.length;i++){
			if(this.list[i].itemID == ID)
				return this.list[i];
		}

	},
	render: function (gd,screen){
		if(this.list.length == 0)return;
		this.list[this.active].render(gd, screen);
		
	},
	read: function (packet){
		var d = packet[3];
		this.active = d[2];
		var newlist = JSON.parse(d[3]);
		for(var i =0;i<newlist.length;i++ ){
			var comName = newlist[i][3][1];
			var com = this.getByID(newlist[i][3][2]);
			if(com){
				com.read(newlist[i]);
				
			}else {	
				com = new window[comName](this.PARENT);
				this.add(com);
				com.read(newlist[i]);
				
			}
		}
		
	},
	send: function (users, io){
		var status = 5;
		if(this.status==0)  status = 4;
		//var packet = new Packet(new Date().getTime(),this.PARENT.id,status,[this.PARENT.id, this.name, this.size, this.r, this.g, this.b]);

		var itemJSON = "[";
		//for(var i=0;i<this.list.length;i++){
		//	if(i>0) itemJSON += ",";
		//	itemJSON += this.list[i].send(users, io);
		//}
		itemJSON += this.list[this.active].send(users, io);
		itemJSON += "]";
		var packet = [new Date().getTime(),this.PARENT.id,status,[this.PARENT.id, this.name, this.active, itemJSON]];
		
		var json = JSON.stringify(packet);
		if(this.status==0) this.status =1;

		return json;
	
	},
	sync: function (users, io){
		var itemJSON = "[";
		for(var i=0;i<this.list.length;i++){
			if(i>0) itemJSON += ",";
			itemJSON += this.list[i].sync(users, io);
		}
		itemJSON += "]";
		var packet = [new Date().getTime(),this.PARENT.id,4,[this.PARENT.id, this.name, this.active, itemJSON]];
		var json = JSON.stringify(packet);
		return json;
	}
});
