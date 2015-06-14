var fs = require("fs");
var path = __dirname + '/public';

function read(f) {
  return fs.readFileSync(f).toString();
}
function include(f) {
  eval.apply(global, [read(f)]);
}
console.log("starting...");
include('./site/js/Base.js');
include('./site/js/Scene.js');
include('./site/js/GameData.js');
include('./site/js/Entity.js');
include('./site/js/Camera.js');
include('./site/js/MultiTest.js');
include('./site/js/Packet.js');
include('./site/js/Component.js');
include('./site/js/ItemController.js');
include('./site/js/Item.js');
include('./site/js/Health.js');
include('./site/js/MyMap.js');
include('./site/js/Gun.js');
include('./site/js/Shotgun.js');
include('./site/js/Handgun.js');
include('./site/js/Machinegun.js');
include('./site/js/Bullet.js');
include('./site/js/DefaultAI.js');
include('./site/js/Respawn.js');
include('./site/js/Lava.js')
include('./site/js/DefaultHuman.js');
include('./site/js/UserManager.js');
include('./site/js/User.js');
include('./site/js/InputController.js');
//include('./site/js/Base.js');
console.log("loaded my javascript.");

var polygon = require('polygon');
var rayVsCircle = require('ray-vs-circle');
var boxIntersect = require('box-intersect');
var connect = require('connect');
var serveStatic = require('serve-static'); 
var express = require('express');

var router = express.Router();
var app = connect(); 
var util = require('util');

console.log(util.inspect(process.memoryUsage()));



router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


app.use(serveStatic('./site')); 

var server = app.listen(8080);
console.log("listening");
var io = require('socket.io').listen(server);
//var users  = [];
var newId=1;
var time;
var scene = new MultiTest();
var gamedata = new GameData(0);
var userManager = new UserManager();
gamedata.userManager = userManager;
gamedata.rayVsCircle = rayVsCircle;
gamedata.boxIntersect = boxIntersect;
gamedata.Line = require('line2');
var count = 0;
var tickLengthMs = 20;

/* gameLoop related variables */
// timestamp of each loop
var previousTick = Date.now()
// number of times gameLoop gets called
var actualTicks = 0

var gameLoop = function () {
  var now = Date.now()

  actualTicks++
  if (previousTick + tickLengthMs <= now) {
    var delta = (now - previousTick) ;/// 1000
    previousTick = now

    scene.update(gamedata,delta);
    gamedata.send(userManager.userConns,io);
    count++;
   // if(count%100==0)
   // console.log(delta+" "+(process.memoryUsage().rss/(1024 * 1024.0)));

   // console.log('delta', delta, '(target: ' + tickLengthMs +' ms)', 'node ticks', actualTicks)
    actualTicks = 0
  }

  if (Date.now() - previousTick < tickLengthMs - 16) {
    setTimeout(gameLoop)
  } else {
    setImmediate(gameLoop)
  }
}

function loop(){
	var now = new Date().getTime(),
	    delta = now - (time || now);
	time = now;
	
  if(now - previousTick < (1000 / frameRate) - 16)
    setTimeout(loop) // sloppy timer
  else
    setImmediate(loop) // ultra accurate method
  setImmediate(loop);
}

var e = new Entity(gamedata.idCount++,-2000,-2000);
e.add(new Lava(e,6000,1805));
gamedata.entities.push(e);
e = new Entity(gamedata.idCount++,4000,-2000);
e.add(new Lava(e,1800,5000));
gamedata.entities.push(e);
e = new Entity(gamedata.idCount++,-2000,-200);
e.add(new Lava(e,1800,5000));
gamedata.entities.push(e);
e = new Entity(gamedata.idCount++,-2000,4000);
e.add(new Lava(e,8000,1800));
gamedata.entities.push(e);
//var loopID = setInterval(loop, 30);
console.log("loop started");

io.on('connection', function(socket){
  socket.disconnect = 0;
  var NEWID = newId++;
  socket.sessionId = NEWID;
  //userManager.userConns.push(socket);
 // console.log(socket.sessionId);
 userManager.add(socket);
  var e = new Entity(gamedata.idCount++,Math.random()*400,Math.random()*400,0);
  e.add(new Respawn(e,NEWID));
  gamedata.entities.push(e);

  
  console.log('a user connected! total:'+gamedata.userManager.users.length);
  gamedata.sync(socket);
  socket.on('get', function(msg){
   var arr = JSON.parse(msg);
   userManager.get(socket, arr);
  });
  socket.on('disconnect', function() {
      socket.disconnect = 1;
      userManager.remove(socket);
      
      //users.splice(i, 1);
      console.log('a user disconnected!');
   });
});
console.log("waiting for people!");

gameLoop();