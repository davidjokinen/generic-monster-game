
window.onload=function(){
	var canvas = document.getElementById("gameScreen1");
	var canvas2 = document.getElementById("gameScreen2");
	var canvas3 = document.getElementById("gameScreen3");
	var screen = new Screen('100%', '100%', canvas, canvas,canvas);  
	var scene = new Book(screen, 550, 200); 
	var game = new BaseGame(screen, scene);
	var time = 0;
	function code(){
		var now = new Date().getTime(),
		delta = now - (time || now);
		time = now;
		var gamedata = 0;
		scene.update(gamedata,delta);
		scene.render(screen);
	};
	function frame1() {
		
		code();
		if ( !window.requestAnimationFrame ) {
			window.setTimeout( frame1, 1000 / 60 );
		}
		else
			window.requestAnimationFrame(frame1);
	};
	if ( !window.requestAnimationFrame ) {
		window.setTimeout( frame1, 1000 / 60 );
	}
	else
		window.requestAnimationFrame(frame1);
}