var Book = Scene.extend({
	
	init: function (screen, size, connections){
		this.count2 = 0;
		this.count = 0;
		function createNoise()
		{ 
			var canvas = document.createElement("canvas"),  
			ctx = canvas.getContext('2d');
			canvas.width	= 300;
			canvas.height 	= 300;
			
			for ( x = 0; x < canvas.width; x++ ) {  
			  for ( y = 0; y < canvas.height; y++ ) {  
				   number = -Math.floor( Math.random() * 14-7 );  
				   ctx.fillStyle = "rgb(" + (number+240) + "," + (number+240) + "," + (number+240) + ")";  
				   ctx.fillRect(x, y, 1, 1);  
			  }
			}  
			var image = new Image();
			image.src = canvas.toDataURL("image/png") ;
			return image; 
		}
		//this.noise = createNoise();
		this.list =new Array();
		//var size = 550;
		for(var x=0;x<screen.ctx.width/size;x++)
			for(var y=0;y<screen.ctx.height/size;y++){
		//for(var i =0;i<9;i++){
			this.list[this.list.length] = Math.random()*size+(x*size-200)+20;
			this.list[this.list.length] = Math.random()*size+(y*size-200)+80;
			while(screen.ctx.height<this.list[this.list.length-1])
				this.list[this.list.length-1] = Math.random()*size+(y*size-200)+80;
		}
		
		this.connections = new Array(connections);
		for(var i =0;i<this.connections.length;i++){
			this.connections[i] = new Packet();
		}
		this.maxConnections = 0;//this.connections.length;
	},

	update: function (gamedata,delta) {
		
		if(delta > 50)
			this.maxConnections -= 50;
		else(this.maxConnections < this.connections.length)
			this.maxConnections += 50;
		if(this.list)
		for(var i =0;i<this.connections.length&&i<this.maxConnections;i++){
			this.connections[i].update(delta, this.list);
		}
		
	},
	
	render: function (screen) {
		
		screen.changeFocus(1);
		var ctx = screen.ctx;

		var size = 4;
		var count = 0;
		var count_max = 50000;
		//Had the background rendered here and then I moved it to the css since it was static
	
		ctx.clearRect( 0, 0, ctx.width, ctx.height );
		
	
		
		//ctx.strokeStyle="rgb(228, 212, 212)";
		if(this.connections.length>500)
			ctx.strokeStyle="rgb(207, 207, 207)";
		else
			ctx.strokeStyle="rgb(217, 217, 217)";
		ctx.beginPath();
		ctx.lineWidth = 2;
		for(var i =0;i<this.connections.length&&i<this.maxConnections;i++){
			this.connections[i].render(screen);
			if(i==50&&this.connections.length>500){
				ctx.stroke();
				ctx.lineWidth = 3;
				//ctx.strokeStyle="rgb(192, 228, 192)";
				ctx.beginPath();
			}
			if(i==250&&this.connections.length>500){
				ctx.stroke();
				ctx.lineWidth = 1;
				//ctx.strokeStyle="rgb(192, 228, 192)";
				ctx.beginPath();
			}
			if(i==120&&this.connections.length<=500){
				ctx.stroke();
				ctx.lineWidth = 1;
				//ctx.strokeStyle="rgb(192, 228, 192)";
				ctx.beginPath();
				
			}
		}
		
		ctx.stroke();
		ctx.fillStyle="#BBB";	
		for(var i =0;i<this.list.length/2;i++){
			var x = this.list[i*2];
			var y = this.list[i*2+1];
			
			ctx.beginPath();
			
			ctx.arc(x, y, size, 0, 2 * Math.PI, false);
			
			
			ctx.fillStyle = "rgb(238, 207, 207)";
			ctx.fill();
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#BBB';
			//ctx.stroke();
			
		}
			
		
	}

});  