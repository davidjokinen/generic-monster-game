var Screen = Class.extend({

	init: function (HEIGHT, WIDTH, LAYER1, LAYER2, LAYER3){
		this.isPercentWidth  = (WIDTH+"").indexOf('%') === -1 ? false : true;
		this.isPercentHeight = (HEIGHT+"").indexOf('%') === -1 ? false : true;
		this.percentWidth = parseInt(WIDTH);
		this.percentHeight = parseInt(HEIGHT);
		this.width = parseInt(WIDTH);
		this.height = parseInt(HEIGHT);



		this.focus = 1;
		this.focusMax = LAYER2 ? (LAYER3 ? 3: 2) :1;

		this.layer1 = LAYER1 ;
		this.ctx1 = this.layer1.getContext("2d");
		if(LAYER2){
			this.layer2 = LAYER2 ;
			this.ctx2 = this.layer2.getContext("2d");
		}
		if(LAYER3){
			this.layer3 = LAYER3 ;
			this.ctx3 = this.layer3.getContext("2d");
		}

		this.canvas = this.layer1;
		this.ctx = this.ctx1;
		//if(!canvas)window.onload=function(){document.body.appendChild(this.canvas);};
		
		var self = this;
		if(this.isPercentWidth || this.isPercentHeight)
			window.addEventListener('resize', function(){ self.resizeAll()}, false);
		this.resizeAll();

		//var renderer = PIXI.autoDetectRenderer(this.width, this.height);
	
		// set the canvas width and height to fill the screen
		//renderer.view.style.width = window.innerWidth + "px";
		//renderer.view.style.height = window.innerHeight + "px";
		//renderer.view.style.display = "block";
		 
		// add render view to DOM
		//document.body.appendChild(renderer.view);

		//this.g = new PIXI.Graphics();

		//this.ctx.fillRect = new this.ctx.drawRect;
	},
	
	resizeCanvas: function (canvas,ctx) {
		if(this.isPercentWidth){
			ctx.width = parseInt(window.innerWidth*1*(this.percentWidth/100.0));
			width = ctx.width;
			canvas.width = ctx.width;
			canvas.style.width = window.innerWidth+'px';

		}
		else{
			ctx.width = this.width;
			canvas.width = this.width;
		}
		if(this.isPercentHeight){
			ctx.height = parseInt(window.innerHeight*1*(this.percentHeight/100.0));
			this.height = ctx.height;
			canvas.height = ctx.height;
			canvas.style.height = window.innerHeight+'px';
		}
		else{
			ctx.height = this.height;
			canvas.height =this.height;
		}
	},
	
	resizeAll: function () {

		this.resizeCanvas(this.layer1, this.ctx1);
		if(this.focusMax > 1)this.resizeCanvas(this.layer2, this.ctx2);
		if(this.focusMax > 2)this.resizeCanvas(this.layer3, this.ctx3);

    },
	
	changeFocus: function (layer) {
		this.focus = layer;
		if(this.focus == 1){
			this.canvas = this.layer1;
			this.ctx = this.ctx1;
		}
		if(this.focus == 2){
			this.canvas = this.layer2;
			this.ctx = this.ctx2;
		}
		if(this.focus == 3){
			this.canvas = this.layer3;
			this.ctx = this.ctx3;
		}
	}
	
});  

