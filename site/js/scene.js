var Scene = Class.extend({
	
	init: function (){
		this.count2 = 0;
		this.count = 0;
	},

	update: function (delta) {
		this.count2++;
		if(this.count2%7==0)
		this.count++;
		
	},
	
	render: function (screen) {
		
		//if(this.count2%7!=0)return;
		screen.changeFocus(this.count%2+1);
		var ctx = screen.ctx;
		var size = 20;
		var count = 0;
		var count_max = 50000;
	
		ctx.clearRect( 0, 0, ctx.width, ctx.height );
		if(this.count%3==0)
			ctx.strokeStyle="#AAF";
		if(this.count%3==1)
			ctx.strokeStyle="#AFA";
		if(this.count%3==2)
			ctx.strokeStyle="#FAA";
		ctx.beginPath();
		
	
		for(var x=0;x<ctx.width/(size);x++)
			for(var y=0;y<ctx.height/(size);y++){
				
				//ctx.fillStyle="#F00";
				if(parseInt(Math.sin((x*y+7*this.count)*this.count)*400+800)%2==0){
					ctx.moveTo(x*(size), y*(size));
					ctx.lineTo(x*(size)+size, y*(size)+size);
				}else{
					ctx.moveTo(x*(size)+size, y*(size));
					ctx.lineTo(x*(size), y*(size)+size);
				}
				//ctx.fillRect(x*(size+1),y*(size+1),size,size);
				//ctx.fillStyle="#0F0";
				//ctx.fillRect(x*size,y*size,size,size);
				//ctx.fillStyle="#00F";
				//ctx.fillRect(x*size,y*size,size,size);
				count++;
				if(y==parseInt(ctx.height/(size+1)-1)&&x==parseInt(ctx.width/(size+1)-1)){
					if(count < count_max){
					//	x = 0;
					//	y = 0;
					}
				}
			}
		ctx.stroke();
	}

});  