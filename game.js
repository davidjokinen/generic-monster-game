var fs = require("fs");
var path = __dirname + '/public';

function read(f) {
  return fs.readFileSync(f).toString();
}
function include(f) {
  eval.apply(global, [read(f)]);
}
console.log("starting...");
include('./site/js/base.js');
include('./site/js/scene.js');
include('./site/js/gamedata.js');
include('./site/js/entity.js');
include('./site/js/camera.js');
include('./site/js/multitest.js');
include('./site/js/packet.js');
include('./site/js/component.js');
include('./site/js/itemcontroller.js');
include('./site/js/item.js');
include('./site/js/health.js');
include('./site/js/mymap.js');
include('./site/js/gun.js');
include('./site/js/shotgun.js');
include('./site/js/handgun.js');
include('./site/js/machinegun.js');
include('./site/js/bullet.js');
include('./site/js/defaultai.js');
include('./site/js/respawn.js');
include('./site/js/lava.js')
include('./site/js/defaulthuman.js');
include('./site/js/usermanager.js');
include('./site/js/user.js');
include('./site/js/inputcontroller.js');
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

var server = app.listen(80);
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
//e.add(new Lava(e,6000,1805));
gamedata.entities.push(e);
e = new Entity(gamedata.idCount++,4000,-2000);
//e.add(new Lava(e,1800,5000));
gamedata.entities.push(e);
e = new Entity(gamedata.idCount++,-2000,-200);
//e.add(new Lava(e,1800,5000));
gamedata.entities.push(e);
e = new Entity(gamedata.idCount++,-2000,4000);
//e.add(new Lava(e,8000,1800));
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