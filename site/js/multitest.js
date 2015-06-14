var MultiTest = Scene.extend({
	
	init: function (){
		this.count2 = 0;
		this.count = 0;
		
		this.maxConnections = 0;//this.connections.length;
	},

	update: function (gd,delta) {
		this.count += delta;

		
		var list = gd.entities;
		if(gd.type == 0){//
			if(this.count  > 30 && list.length < 10){
				this.count = 0;
				var e = new Entity(gd.idCount++,Math.random()*400,Math.random()*400,0);
				e.add(new DefaultAI(e));
				e.add(new Health(e,100,100));
				list.push(e);
				
				

				//console.log('Entity added!');
			}
			else {
				

			}
			for(var i =0;i<list.length;i++){
				if(list[i].status == 2)
				{
					//console.log('Entity removed!');
					list[i].dying(gd);
					list.splice(i,1);
					i--;
				}
			}
		}else{
			gd.userManager.update(gd,delta);
			var list2 = gd.localEntities;
			for(var i =0;i<list2.length;i++){
				list2[i].update(gd,delta);
			}
			for(var i =0;i<list.length;i++){
				if(list[i].status == 2){
					list[i].dying(gd);
					//console.log("dying");
					list.splice(i,1);
					i--;
				}

			}
			var input =  gd.input.state;
			if(input.full){

				var elem = document.getElementById("gameScreen1");
				if (elem.requestFullscreen) {
				  elem.requestFullscreen();
				} else if (elem.msRequestFullscreen) {
				  elem.msRequestFullscreen();
				} else if (elem.mozRequestFullScreen) {
				  elem.mozRequestFullScreen();
				} else if (elem.webkitRequestFullscreen) {
				  elem.webkitRequestFullscreen();
				}
			}
		}

		for(var i =0;i<list.length;i++){
			list[i].update(gd,delta);
		}
		

		
	},
	
	render: function (gd,screen) {
		
		
		var ctx = screen.ctx;
		ctx.fillStyle='rgb(240, 240, 255)';
		//if( !(gd.glitch))
		gd.map.render(gd,screen);
		//ctx.fillRect( 0, 0, ctx.width, ctx.height );
		/*
		var c = gd.camera;
		var box = parseInt(100*c.scale);
		//ctx.strokeStyle="rgb(180, 180, 255)";
		ctx.strokeStyle="rgb(120, 120, 120)";
		ctx.beginPath();
		for(var x =0;x<=ctx.width/box+1;x++){
			for(var y =0;y<=ctx.height/box+1;y++){
				//if((x+y+parseInt(ctx.width/box)*parseInt(c.y/(box))+parseInt(c.x/(box)))%2==0)ctx.fillStyle='rgb(240, 100, 255)';
				//else 
			//	ctx.fillStyle='rgb(100, 180, 100)';
			//	ctx.fillRect( parseInt(x*box-c.x%(box)), parseInt(y*box-c.y%(box)), box, box );
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
		*/
		ctx.strokeStyle="rgb(255, 110, 110)";
		//ctx.strokeRect(0-c.x,0-c.y,3000,2100);
		
		var list = gd.localEntities;
		for(var i =0;i<list.length;i++){
			list[i].render(gd,screen);
		}
		list = gd.entities;
		for(var i =0;i<list.length;i++){
			list[i].render(gd,screen);
		}
		if(!document.hasFocus()){
			ctx.fillStyle='rgba(0, 0, 0, .4)';
		//	ctx.fillRect( 0, 0, ctx.width, ctx.height );
		}
		ctx.fillStyle="#000";
		ctx.fillText("Entity count: "+gd.dataSize,10,50);
		gd.userManager.render(gd,screen);
		gd.glitch = 0;
	}

});  