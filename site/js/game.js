
window.onload=function(){
	var socket = io.connect('ws://localhost:8080/');
  
	var canvas = document.getElementById("gameScreen1");
	//var canvas2 = document.getElementById("gameScreen2");
	//var canvas3 = document.getElementById("gameScreen3");
	var screen = new Screen('100%', '100%', canvas, canvas,canvas);  
	var scene = new MultiTest(screen, scene);
	var gamedata = new GameData(1);
	var userManager = new UserManager();
	var input = new InputController();
	window.addEventListener('keydown', function(e){ input.keydown(e);requestTick();}, false);
	window.addEventListener('keyup',  function(e){input.keyup(e);requestTick();}, false);
	window.addEventListener('mousemove',  function(e){input.mousemove(e);requestTick();}, false);
	window.addEventListener('mousedown',  function(e){input.clickDown(e);}, false);
	window.addEventListener('mouseup',  function(e){input.clickUp(e);}, false);
	gamedata.userManager = userManager;
	gamedata.screen = screen;
	gamedata.input = input;
	socket.on('sync', function (json) {
	      //gamedata.sync(JSON.parse(json));
	      var arr = JSON.parse(json);
	      console.log('SYNCING! ('+arr.length+')');
	      gamedata.clear();
		  for(var i =0;i<arr.length;i++)
	      	gamedata.get(arr[i]);
	      
	  });
	socket.on('get', function (json) {
		  var arr = JSON.parse(json);
		  gamedata.dataSize = json.length;
		 // console.log('Got: ('+json.length+')');
		  for(var i =0;i<arr.length;i++)
	      	gamedata.get(arr[i]);
	      
	  });
	socket.on('getUsers', function (json) {
		  var arr = JSON.parse(json);
		  //console.log('Got User info!');
		  //for(var i =0;i<arr.length;i++)
	      	gamedata.userManager.read(arr);
	      	
	  });
	socket.on('syncUsers', function (json) {
		  var arr = JSON.parse(json);
		 // console.log('Got: ('+json.length+')');
		 // for(var i =0;i<arr.length;i++)
	      	gamedata.userManager.read(arr);
	      	
	  });
	var time = 0;
	var ticking = false;
	function requestTick(){
		if(!ticking){
			requestAnimationFrame(update);
			ticking = true;
		}
		//
	};

	function update(){
		var now = Date.now(),
		delta = now - (time | now);
		time = now;
		input.update(gamedata,delta);
		gamedata.camera.update(gamedata,delta);
		var curInput = input.send();
		socket.emit('get', curInput);
		gamedata.update();
		scene.update(gamedata,delta);
		scene.render(gamedata,screen);
		ticking = false;

	}
	var sock = 0;
	function frame1() {
		
	//	();
		//if((sock++)%10!=0)
		requestTick();
	//	if ( !window.requestAnimationFrame ) {
			//window.setInterval( code, 1000 / 60 );
	//	}
	//	else
		window.requestAnimationFrame(frame1);
	};
	if ( !window.requestAnimationFrame ) {
		window.setTimeout( frame1, 1000 / 60 );
	}
	else
		window.requestAnimationFrame(frame1);
}