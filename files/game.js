
function dist(a, b){
  return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
}
function keyCode(keyChar){
  console.log(keyChar.charCodeAt(0))
  return Number(keyChar.charCodeAt(0));
}
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

var Container = PIXI.Container,
autoDetectRenderer = PIXI.autoDetectRenderer,
loader = PIXI.loader,
resources = PIXI.loader.resources,
Sprite = PIXI.Sprite,
Point = PIXI.Point;

var renderer = autoDetectRenderer(256, 256);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);
//Create a container object called the `stage`
var stage = new Container();
stage.interactive = true;
stage.rightclick = function(event){
  battleship.move(event.data.global.x,event.data.global.y);
};
background = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, 3000, 3000);
stage.addChild(background);
//Tell the `renderer` to `render` the `stage`
renderer.render(stage);

renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);
window.onresize = function (event){
  renderer.resize(window.innerWidth, window.innerHeight);
};

loader
.add([
  "files/images/Human-Battleship.png",
  "files/images/Human-Battlecruiser.png"
])
.load(setup);



class Ship extends Sprite {
  constructor(texture){
    super(texture);
    this.rotation = 0;
    this.angularVelocity = 0;
    this.turnRate = 1;
    this.acceleration = 1;
    this.velocity = 0;
    this.maxVelocity = 2;
    this.minVelocity = -0.25;
    this.dest = new Point();
    this.hasDest = false;
  }

  move(x,y){
    this.hasDest = true;
    if(!y){
      this.dest = x;
      return;
    }
    this.dest.x=x;
    this.dest.y=y;
  }

  forward(){
    this.braking = false;
    this.velocity = Math.min(this.maxVelocity, this.velocity + this.acceleration * deltaTime);
  }
  reverse(){
    this.braking = false;
    this.velocity = Math.max(this.minVelocity, this.velocity - this.acceleration * deltaTime);
  }
  stop(){
    this.braking = true;
  }
  brake(){
    if(Math.abs(this.velocity) <= this.acceleration * deltaTime){
      this.velocity = 0;
      this.braking = false;
    }else if(this.velocity > 0){
      this.velocity = Math.max(this.minVelocity, this.velocity - this.acceleration * deltaTime);
    }else{
      this.velocity = Math.min(this.maxVelocity, this.velocity + this.acceleration * deltaTime);
    }
  }
  update(){
    if(this.hasDest){
      var destAngle = (Math.atan2(this.dest.y-this.y,this.dest.x-this.x ) + Math.PI/2 + 2*Math.PI)%(2*Math.PI);
      if(Math.abs(destAngle - this.rotation) < this.turnRate * deltaTime || Math.abs(destAngle - this.rotation + 2*Math.PI) < this.turnRate * deltaTime){
        this.rotation = destAngle;
        this.angularVelocity = 0;
      }else if((this.rotation < destAngle && destAngle - this.rotation < Math.PI)||(this.rotation > destAngle && this.rotation - destAngle > Math.PI)){
        this.angularVelocity = this.turnRate;
      }else{
        this.angularVelocity = -this.turnRate;
      }
      this.rotation += this.angularVelocity * deltaTime;
      this.rotation = (this.rotation + 2*Math.PI)%(2*Math.PI);
    }
    if(this.braking){
      this.brake();
    }
    this.x += this.velocity * Math.cos(this.rotation - Math.PI/2) * deltaTime*60;
    this.y += this.velocity * Math.sin(this.rotation - Math.PI/2) * deltaTime*60;
    if(dist(this, this.dest) < this.velocity*2){
      this.hasDest = false;
    }

  }
}

var battleship;
var w = keyboard(keyCode("W"));
var s = keyboard(keyCode("S"));
var x = keyboard(keyCode("X"));
function setup() {
  battleship = new Ship(resources["files/images/Human-Battleship.png"].texture);
  battleship.anchor.x = 0.5;
  battleship.anchor.y = 0.5;
  battleship.x = 500;
  battleship.y = 250;

  x.press = function(event){
    battleship.stop();
  }
  stage.addChild(battleship);
  requestAnimationFrame(update);

}
var prev = Date.now();
var now = Date.now();
var deltaTime = (now - prev)/1000; //in seconds

function update() {
  var now = Date.now();
  deltaTime = (now - prev)/1000;
  prev = now;
  if(w.isDown){
    battleship.forward();
  }
  if(s.isDown){
    battleship.reverse();
  }
  requestAnimationFrame(update);

  battleship.update();
  renderer.render(stage);
}
