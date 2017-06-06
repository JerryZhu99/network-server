import _ from "./pixi.js";

import * as Time from "./time.js";

import * as Keyboard from "./keyboard.js";

import {Ship} from "./ship.js";

const BORDER = 10;
const SCROLLSPEED = 500;


var renderer = PIXI.autoDetectRenderer(256, 256);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);
//Create a container object called the `stage`
var stage = new PIXI.Container();
stage.interactive = true;
stage.rightclick = function(event){
  var location = event.data.getLocalPosition(map);
  battleship.move(location.x,location.y);
};

var background = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, 3000, 3000);
stage.addChild(background);
var map = new PIXI.Container();
stage.addChild(map);


document.addEventListener("wheel", function(event){
  let zoomIn = event.deltaY < 0; //simplified
  let zoomFactor;
  if (zoomIn) {
    zoomFactor = 1.1;
  } else {
    zoomFactor = (1/1.1);
  }

  //zoom
  map.scale.x *= zoomFactor;
  map.scale.y *= zoomFactor;

  //center on cursor
  let mouseLocation = renderer.plugins.interaction.eventData.data.global;
  map.x -= (mouseLocation.x - map.x) * (zoomFactor - 1);
  map.y -= (mouseLocation.y - map.y) * (zoomFactor - 1);

  correct();

  renderer.render(stage);
  event.preventDefault();
}, false);

function correct() {
  /*
  //keep in frame
  map.x = Math.min(0, map.x);
  map.y = Math.min(0, map.y);

  //keep width in bounds
  let visible_width = (renderer.width * map.scale.x) + map.x;
  if (visible_width < renderer.view.width) {
    map.x = Math.min(0, renderer.view.width - (renderer.width * map.scale.x));
    if (map.x == 0) {
      map.scale.x = renderer.view.width / renderer.width;
    }
  }

  //keep height in bounds
  let visible_height = (renderer.height * map.scale.y) + map.y;
  if (visible_height < renderer.view.height) {
    map.y = Math.min(0, renderer.view.height - (renderer.height * map.scale.y));
    if (map.y == 0) {
      map.scale.y = renderer.view.height / renderer.height;
    }
  }*/

  //keep aspect ratio
  if (map.scale.y != map.scale.x) {
    map.scale.x = Math.max(map.scale.x, map.scale.y);
    map.scale.y = Math.max(map.scale.x, map.scale.y);
  }
}

//Tell the `renderer` to `render` the `stage`
renderer.render(stage);

renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

window.onresize = function (event){
  renderer.resize(window.innerWidth, window.innerHeight);
};

PIXI.loader
.add([
  "files/images/Human-Battleship.png",
  "files/images/Human-Battlecruiser.png",
  "files/images/1.jpg"
])
.load(setup);



var battleship;
var keyW = Keyboard.key(Keyboard.keyCode("W"));
var keyA = Keyboard.key(Keyboard.keyCode("A"));
var keyS = Keyboard.key(Keyboard.keyCode("S"));
var keyD = Keyboard.key(Keyboard.keyCode("D"));
var keyX = Keyboard.key(Keyboard.keyCode("X"));
var keyQ = Keyboard.key(Keyboard.keyCode("Q"));
var keyE = Keyboard.key(Keyboard.keyCode("E"));
var keyShift = Keyboard.key(16);
var keyF11 = Keyboard.key(122);

function setup() {
  var spacebg = new PIXI.extras.TilingSprite(PIXI.loader.resources["files/images/1.jpg"].texture, 5000, 5000);
  map.addChild(spacebg);

  battleship = new Ship(PIXI.loader.resources["files/images/Human-Battleship.png"].texture);

  battleship.x = 500;
  battleship.y = 250;

  keyA.press = function(event){
    battleship.rotateLeft();
  };
  keyA.release = function(event){
    battleship.stopRotation();
  };
  keyD.press = function(event){
    battleship.rotateRight();
  };
  keyD.release = function(event){
    battleship.stopRotation();
  };
  keyX.press = function(event){
    battleship.stop();
  };
  keyShift.press = function(event){
    battleship.toggleCruise();
  };
  keyF11.press = function(event){
    if (document.body.requestFullscreen) {
    	document.body.requestFullscreen();
    } else if (document.body.webkitRequestFullscreen) {
    	document.body.webkitRequestFullscreen();
    } else if (document.body.mozRequestFullScreen) {
    	document.body.mozRequestFullScreen();
    } else if (document.body.msRequestFullscreen) {
    	document.body.msRequestFullscreen();
    }
    renderer.resize(window.innerWidth, window.innerHeight);

  };
  map.addChild(battleship);
  requestAnimationFrame(update);

}

function update() {
  Time.updateDelta();

  let mouseLocation = renderer.plugins.interaction.eventData.data.global;
  console.log(mouseLocation);
  if(mouseLocation.x < BORDER){
    map.x += map.scale.x * Time.deltaTime * SCROLLSPEED;
  }
  if(mouseLocation.x > window.innerWidth - BORDER){
    map.x -= map.scale.x * Time.deltaTime * SCROLLSPEED;
  }
  if(mouseLocation.y < BORDER){
    map.y += map.scale.y * Time.deltaTime * SCROLLSPEED;
  }
  if(mouseLocation.y > window.innerHeight - BORDER){
    map.y -= map.scale.y * Time.deltaTime * SCROLLSPEED;
  }
  if(keyW.isDown){
    battleship.forward();
  }
  if(keyS.isDown){
    battleship.reverse();
  }
  if(keyQ.isDown){
    battleship.strafeLeft();
  }
  if(keyE.isDown){
    battleship.strafeRight();
  }
  requestAnimationFrame(update);

  battleship.update();
  renderer.render(stage);
}
