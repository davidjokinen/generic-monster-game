var Camera = Class.extend({
	init: function (){
		this.x =0;
		this.y =0;

		this.scale =1;
		this.focus =0;


	},
	update: function(gd, delta) {
		
		if(gd.input.state.zoomOut)this.scale*=1.05;
		if(gd.input.state.zoomIn)this.scale*=.95;
		if(this.focus){
			var newX = (this.focus.posX+10)*this.scale-gd.screen.ctx.width/2.0;
			var newY = (this.focus.posY+10)*this.scale-gd.screen.ctx.height/2.0;
			var difX = gd.input.state.x*this.scale - gd.screen.ctx.width/2.0;
			var difY = gd.input.state.y*this.scale - gd.screen.ctx.height/2.0;
			this.x += parseInt(.1*((newX+difX*.66) -this.x));
			this.y += parseInt(.1*((newY+difY*.66) -this.y));
		//	this.x += (this.x-((this.focus.posX+10)*this.scale-gd.screen.ctx.width/2.0))*.01;
		//	this.y += (this.y-((this.focus.posY+10)*this.scale-gd.screen.ctx.height/2.0))*.01;
		}
	}


}); 

