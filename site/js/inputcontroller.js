var InputController = Class.extend({

	init: function (){
		this.state = new InputState();
		this.nextstate = new InputState();

		
	},
	update: function(gd, delta) {
		if(gd.camera.focus){
			var c = gd.camera;
			var dx = (gd.camera.focus.posX*gd.camera.scale+10*gd.camera.scale - gd.camera.x) - this.state.x*gd.camera.scale; 
			var dy = (gd.camera.focus.posY*gd.camera.scale+10*gd.camera.scale - gd.camera.y) - this.state.y*gd.camera.scale;
			this.state.r = Math.atan(dy/-dx);
			
			if(dy>0&&dx>0)this.state.r=3.14+this.state.r;
			if(dy<0&&dx>0)this.state.r+=3.14;
			if(dy<0&&dx<0)this.state.r=2*3.14+this.state.r;
			if(dy==0&&dx>0)this.state.r=3.14;
			if(dy==0&&dx<0)this.state.r=0;
			if(dx==0&&dy>0)this.state.r=3.14/2;
			if(dx==0&&dy<0)this.state.r=3.14/2+3.14;
			this.state.r *= -57.2957795;
			//console.log(dx+" "+dy+" "+this.state.r*57.2957795);
		}
	},
	send: function (){
		return this.state.send();
	},
	keydown: function(e) {
		// console.log('test:'+e.keyCode);
		if(e.keyCode==32)
			this.state.up = 1;
		if(e.keyCode==38)
			this.state.up = 1;
		if(e.keyCode==40)
			this.state.down = 1;
		if(e.keyCode==37)
			this.state.left = 1;
		if(e.keyCode==39)
			this.state.right = 1;

		if(e.keyCode==87)
			this.state.up = 1;
		if(e.keyCode==83)
			this.state.down = 1;
		if(e.keyCode==65)
			this.state.left = 1;
		if(e.keyCode==68)
			this.state.right = 1;
		if(e.keyCode==80)
			this.state.restart = 1;	
		if(e.keyCode==189)
			this.state.zoomOut = 1;	
		if(e.keyCode==187)
			this.state.zoomIn = 1;	

		if(e.keyCode==192)
			this.state.tab = 1;	
		if(e.keyCode==69)
			this.state.interact = 1;	
		if(e.keyCode==82)
			this.state.reload = 1;

		if(e.keyCode==27)
			this.state.esc = 1;	
		if(e.keyCode==48)
			this.state.full = 1;
		if(e.keyCode==16)
			this.state.shift = 1;
	},
	
	keyup: function(e) {
		if(e.keyCode==32)
			this.state.up = 0;
		if(e.keyCode==38)
			this.state.up = 0;
		if(e.keyCode==40)
			this.state.down = 0;
		if(e.keyCode==37)
			this.state.left = 0;
		if(e.keyCode==39)
			this.state.right = 0;
		if(e.keyCode==87)
			this.state.up = 0;
		if(e.keyCode==83)
			this.state.down = 0;
		if(e.keyCode==65)
			this.state.left = 0;
		if(e.keyCode==68)
			this.state.right = 0;
		if(e.keyCode==80)
			this.state.restart = 0;	
		
		if(e.keyCode==192)
			this.state.tab = 0;	
		if(e.keyCode==69)
			this.state.interact = 0;	
		if(e.keyCode==82)
			this.state.reload = 0;

		if(e.keyCode==189)
			this.state.zoomOut = 0;	
		if(e.keyCode==187)
			this.state.zoomIn = 0;	

		if(e.keyCode==27)
			this.state.esc = 0;	
		if(e.keyCode==48)
			this.state.full = 0;
		if(e.keyCode==16)
			this.state.shift = 0;
	},

	mousemove: function(e) {
		this.state.x = e.clientX;
		this.state.y = e.clientY;
	},

	clickDown: function(e) {
		if (e.button & 1) e.which = 1      // Left
   		else if (e.button & 4) e.which = 2 // Middle
    	else if (e.button & 2) e.which = 3 // Right

    	if(e.which == 1)this.state.action1 = 1;
    	if(e.which == 3)this.state.action2 = 1;

	},
	clickUp: function(e) {
		if (e.button & 1) e.which = 1      // Left
   		else if (e.button & 4) e.which = 2 // Middle
    	else if (e.button & 2) e.which = 3 // Right

    	if(e.which == 1)this.state.action1 = 0;
    	if(e.which == 3)this.state.action2 = 0;

	}


});  	



var InputState = Class.extend({
	init: function (){
		this.up = 0;
		this.down = 0;
		this.left = 0;
		this.right = 0;

		this.x = 0;
		this.y = 0;
		this.r = 0;

		this.zoomOut = 0;
		this.zoomIn = 0;

		this.tab = 0;
		this.interact = 0;
		this.reload = 0;

		this.shift = 0;

		this.esc = 0;

		this.full = 0;

		this.action1 = 0;
		this.action2 = 0;
		
		this.restart = 0;

	},
	read: function (data){
		this.up = data[0];
		this.down = data[1];
		this.left = data[2];
		this.right = data[3];

		this.r = data[5];
		this.action1 = data[6];
		this.action2 = data[7];
		
		this.restart = data[4];
		this.interact =  data[8];
		this.reload =  data[9];
		this.shift = data[10];
	},
	send: function (){
		var packet = [this.up, this.down,this.left,this.right,this.restart,this.r,this.action1,this.action2,this.interact,this.reload,this.shift];
		var json = JSON.stringify(packet);
		return json;
	}
});  





