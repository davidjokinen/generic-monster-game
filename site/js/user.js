var User = Class.extend({
	init: function (ID){
		this.id = ID;
		this.name = "Unnamed!";
		this.input = new InputState();
		this.hunterKills = 0;
		this.monsterKills = 0;
		this.deaths = 0;
		this.xp = 0;
		this.socket;
	},
	read: function (data){
		this.id = data[0];
		this.name = data[1];
		this.hunterKills = data[2]; 
		this.monsterKills = data[3]; 
		this.deaths = data[4];
		this.xp = data[5]; 
 
	},
	send: function (users, io){
		var packet = [this.id, this.name, this.hunterKills, this.monsterKills, this.deaths, this.xp];
		var json = JSON.stringify(packet);
		return json;
	},
	sync: function (users, io){
		var packet = [this.id, this.name, this.hunterKills, this.monsterKills, this.deaths, this.xp];
		var json = JSON.stringify(packet);
		return json;
	}
});