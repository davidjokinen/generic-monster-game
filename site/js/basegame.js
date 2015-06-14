var BaseGame = Class.extend({

	init: function (screen, scene){
		this.screen = screen;
		this.scene = scene;
		this.time;
		
	},


	start: function (){
		var self = this;
		this.loop = function(){
			var now = new Date().getTime(),
			 delta = now - (this.time || now);
	 
			this.time = now;
			var gamedata = 0;
			this.scene.update(gamedata,delta);
			this.scene.render(this.screen);
		
			//window.requestAnimationFrame(function(){self.loop()});
		}
		
		window.requestAnimationFrame(function(){
			var now = new Date().getTime(),
			 delta = now - (this.time || now);
	 
			this.time = now;
			var gamedata = 0;
			this.scene.update(gamedata,delta);
			this.scene.render(this.screen);
		
			//window.requestAnimationFrame(function(){self.loop()});
		
		});
	}

	
});  

