var MyMap = Class.extend({
	init: function (){
		this.image ;
		//this.canvas = document.createElement("canvas"),  
		//this.ctx = this.canvas.getContext('2d');
	
		this.buf;
		this.buf8;
		this.data;
		this.imageData;
		this.container;
		this.floor;
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
		var box = parseInt(200*gd.camera.scale);
		
		var c = gd.camera;
		
			
		
		var size = this.size;
		//var ctx = screen.ctx;
		var c = gd.camera;
		var graphics = gd.graphics;
		//ctx.clearRect ( 0 , 0 , ctx.width, ctx.height );
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
		
		 
		//graphics.beginFill(0xe0e0f0 );
		
		
		//this.floor.addChild(graphics);
 		
 		 /*
		// begin a green fill..
		graphics.beginFill(0xc8c8c8 , 1);
		graphics.lineStyle(2, 0xc8c8c8, 1);
		 
		// draw a triangle using lines
		//graphics.moveTo(0,0);
		//graphics.lineTo(-50, 100);

		//ctx.strokeStyle="rgb(200, 200, 200)";
		for(var x =0;x<=gd.renderer.width/box+1;x++){
			
		   graphics.moveTo(parseInt(x*box-c.x%(box)), 0);
		   graphics.lineTo(parseInt(x*box-c.x%(box)), gd.renderer.height );
		    
		}
		//graphics.endFill();
		
		
		//graphics.beginFill( 0xc8c8c8,1);
		//gd.renderer.render(graphics);
		for(var y =0;y<=gd.renderer.height/box+1;y++){
		    graphics.moveTo(0, parseInt(y*box-c.y%(box)));
		    graphics.lineTo(gd.renderer.width, parseInt(y*box-c.y%(box)) );
		}
		graphics.endFill();*/
		//gd.renderer.render(graphics);
		
		//ctx.stroke();
		//ctx.strokeStyle='#999';
		//ctx.fillStyle='#BBB';
		
		var boxes = this.getBoxes();
		var list = [];
		for(var i =0;i<boxes.length;i++){
			var box = boxes[i];
			if(!((box[0]>=c.x&&box[0]<=c.x+gd.renderer.width||box[2]>=c.x+0&&box[2]<=c.x+gd.renderer.width)&&(box[1]>=c.y+0&&box[1]<=c.y+gd.renderer.height||box[3]>=c.y+0&&box[3]<=c.y+gd.renderer.height)))
				continue;
			var midX = gd.renderer.width/2;
			var midY = gd.renderer.height/2;

			var playerX = c.focus.posX;
			var playerY = c.focus.posY;
			
			var x1 = box[0]-c.x;
			var y1 = box[1]-c.y;
			var x2 = box[2]-c.x;
			var y2 = box[1]-c.y;
			var x4 = box[0]-c.x;
			var y4 = box[3]-c.y;
			var x3 = box[2]-c.x;
			var y3 = box[3]-c.y;

			var angle1 = Math.atan((x1-midX)/(y1-midY));
			var angle2 = Math.atan((x2-midX)/(y1-midY));
			var angle3 = Math.atan((x1-midX)/(y4-midY));
			var angle4 = Math.atan((x2-midX)/(y4-midY));

			var angle5 = Math.atan((box[0]-playerX)/(box[1]-playerY));
			var angle6 = Math.atan((box[2]-playerX)/(box[1]-playerY));
			var angle7 = Math.atan((box[2]-playerX)/(box[3]-playerY));
			var angle8 = Math.atan((box[0]-playerX)/(box[3]-playerY));
			
			var ay1 = (y1-midY) <0 ? -1 : 1;
			var ay2 = (y1-midY) <0 ? -1 : 1;
			var ay3 = (y3-midY) <0 ? -1 : 1;
			var ay4 = (y3-midY) <0 ? -1 : 1;
			
			var ay5 = (box[1]-playerY) <0 ? -1 : 1;
			var ay6 = (box[1]-playerY) <0 ? -1 : 1;
			var ay7 = (box[3]-playerY) <0 ? -1 : 1;
			var ay8 = (box[3]-playerY) <0 ? -1 : 1;
			
			var size =.4;
			var size1 = size*Math.sqrt(Math.pow(x1-midX,2)+Math.pow(y1-midY,2));
			var size2 = size*Math.sqrt(Math.pow(x2-midX,2)+Math.pow(y1-midY,2));
			var size3 = size*Math.sqrt(Math.pow(x1-midX,2)+Math.pow(y3-midY,2));
			var size4 = size*Math.sqrt(Math.pow(x2-midX,2)+Math.pow(y3-midY,2));

			var size5 = 100000*Math.sqrt(Math.pow(box[0]-playerX,2)+Math.pow(box[1]-playerY,2));
			var size6 = 100000*Math.sqrt(Math.pow(box[2]-playerX,2)+Math.pow(box[1]-playerY,2));
			var size7 = 100000*Math.sqrt(Math.pow(box[0]-playerX,2)+Math.pow(box[3]-playerY,2));
			var size8 = 100000*Math.sqrt(Math.pow(box[2]-playerX,2)+Math.pow(box[3]-playerY,2));
			
			var x1h = x1+size1*ay1*Math.sin(angle1);
			var y1h = y1+size1*ay1*Math.cos(angle1);
			var x2h = x2+size2*ay2*Math.sin(angle2);
			var y2h = y2+size2*ay2*Math.cos(angle2);
			var x3h = x3+size4*ay4*Math.sin(angle4);
			var y3h = y3+size4*ay4*Math.cos(angle4);
			var x4h = x4+size3*ay3*Math.sin(angle3);
			var y4h = y4+size3*ay3*Math.cos(angle3);


			var x5h = x1+size5*ay5*Math.sin(angle5);
			var y5h = y1+size5*ay5*Math.cos(angle5);
			var x6h = x2+size6*ay6*Math.sin(angle6);
			var y6h = y2+size6*ay6*Math.cos(angle6);
			var x7h = x3+size7*ay7*Math.sin(angle7);
			var y7h = y3+size7*ay7*Math.cos(angle7);
			var x8h = x4+size8*ay8*Math.sin(angle8);
			var y8h = y4+size8*ay8*Math.cos(angle8);

			graphics.beginFill(0x666666);
			if(box[1]>playerY)
			graphics.drawPolygon([x1,y1,x5h,y5h,x6h,y6h,x2,y2]);
			if(box[2]<playerX)
			graphics.drawPolygon([x2,y2,x6h,y6h,x7h,y7h,x3,y3]);
			if(box[3]<playerY)
			graphics.drawPolygon([x3,y3,x7h,y7h,x8h,y8h,x4,y4]);
			if(box[0]>playerX)
			graphics.drawPolygon([x4,y4,x8h,y8h,x5h,y5h,x1,y1]);
			//graphics.drawPolygon([x1,y1,x5h,y5h,x6h,y6h,x2,y2]);
			//graphics.drawPolygon([x1,y1,x5h,y5h,x6h,y6h,x2,y2]);

			graphics.beginFill(0x999999 , 1);
			if(box[1]>playerY)
			graphics.drawPolygon([x1,y1,x1h,y1h,x2h,y2h,x2,y2]);
			
			if(box[3]<playerY)
			graphics.drawPolygon([x3,y3,x3h,y3h,x4h,y4h,x4,y4]);
			//graphics.beginFill(0xAAAAAA , 1);
			if(box[2]<playerX)
			graphics.drawPolygon([x2,y2,x2h,y2h,x3h,y3h,x3,y3]);
			if(box[0]>playerX)
			graphics.drawPolygon([x4,y4,x4h,y4h,x1h,y1h,x1,y1]);
			
			
			list.push([x1h, y1h, x3h-x1h, y3h-y1h]);
			//ctx.strokeRect( box[0]-c.x, box[1]-c.y, box[2]-box[0], box[3]-box[1] );
		}
		for(var i =0;i<list.length;i++){
			graphics.beginFill(0xBBBBBB );
			graphics.drawRect(list[i][0],list[i][1],list[i][2],list[i][3]);
		}
		
		
				
	},
	getBoxes: function(point){
		var boxes = [[1000, 0, 1050, 50]];
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
