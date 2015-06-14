var Packet = Class.extend({
	init: function (time,id,status,data){
		this.time = time;
		this.id = id;
		this.status = status;
		this.data = data;
	}

});