var MyMap = Class.extend({
	init: function (){
		this.image ;
		//this.canvas = document.createElement("canvas"),  
		//this.ctx = this.canvas.getContext('2d');
	
		this.buf;
		this.buf8;
		this.data;
		this.imageData;
	},
	name: function (){
		return this.name;
	},
	update: function (gd, delta){
		if(gd.type == 0){//server 
			
		}
		else if(gd.type == 1){//client
			
			
		}
	},
	render: function (gd,screen){
		
		var size = this.size;
		var ctx = screen.ctx;
		var c = gd.camera;
		ctx.clearRect ( 0 , 0 , ctx.width, ctx.height );
		//if(1)return;
		/*if(!this.buf){
			
			this.canvas.width	= ctx.width;
			this.canvas.height 	= ctx.height;
			this.imageData = new ImageData(ctx.width, ctx.height);//this.ctx.getImageData(0, 0, this.ctx.width, this.ctx.height);

			this.buf = new ArrayBuffer(this.imageData.data.length);
			this.buf8 = new Uint8ClampedArray(this.buf);
			this.data = new Uint32Array(this.buf);


		}*/
		//for (var y = 0; y < ctx.height; ++y) {
		//	    for (var x = 0; x < ctx.width; ++x) {
		//	        var value = parseInt(127+100*Math.random()) & 0xff;

		//	        this.data[y * ctx.width + x] =
		//	            (255   << 24) |    // alpha
		//	            (100 << 16) |    // blue
		//	            (value <<  8) |    // green
		//	             100;            // red
		//	    }
		//	}
		//	this.imageData.data.set(this.buf8);
		//	this.ctx.putImageData(this.imageData, 0, 0);
			//this.image = new Image(ctx.width, ctx.height)
			//this.image.src = this.canvas.toDataURL("image/png") ; 
//			console.log(1);

		
	//	ctx.drawImage(this.canvas,0,0);
		var box = parseInt(200*gd.camera.scale);
		
		for(var x =-1;x<=ctx.width/box+1;x++){
			for(var y =-1;y<=ctx.height/box+1;y++){
				if(((x+y-parseInt(c.y/(box))-parseInt(c.x/(box))))%2==0)ctx.fillStyle='#f0f0ff';
				else 
				ctx.fillStyle='#e0e0f0';
				ctx.fillRect( parseInt(x*box-c.x%(box)), parseInt(y*box-c.y%(box)), box, box );
			}
		}

		ctx.strokeStyle="rgb(200, 200, 200)";
		for(var x =0;x<=ctx.width/box+1;x++){
			
		    ctx.moveTo(parseInt(x*box-c.x%(box)), 0);
		    ctx.lineTo(parseInt(x*box-c.x%(box)), ctx.height );
		    
		}
		for(var y =0;y<=ctx.height/box+1;y++){
		    ctx.moveTo(0, parseInt(y*box-c.y%(box)));
		    ctx.lineTo(ctx.width, parseInt(y*box-c.y%(box)) );
		}
		ctx.stroke();
		ctx.strokeStyle='#999';
		ctx.fillStyle='#BBB';

		var boxes = this.getBoxes();
		for(var i =0;i<boxes.length;i++){
			var box = boxes[i];
			ctx.fillRect( box[0]-c.x, box[1]-c.y, box[2]-box[0], box[3]-box[1] );
			ctx.strokeRect( box[0]-c.x, box[1]-c.y, box[2]-box[0], box[3]-box[1] );
		}

		


		
		//ctx.fillRect( 500-c.x, 500-c.y, 300, 300 );

		//
				
	},
	getBoxes: function(point){
		var boxes = [];
		var boxes2 = [
			  [1000, 0, 1500, 500], 
			  [1501, 100, 2500, 150],
			  [1800, 400, 2500, 1200],   
			  [500, 500, 800, 800],
			  [300, 801, 600, 1400],
			  [800, 1101, 1400, 1400],
			  [500, 1700, 2300, 2300]
			]
			return boxes2;
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
