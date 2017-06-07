import _ from "./pixi.js";

import * as Time from "./time.js";

import * as Keyboard from "./keyboard.js";

import * as Settings from "./settings.js"

import * as Input from "./input.js"

import * as MathUtils from "./mathutils.js"

import {
  Ship
} from "./ship.js";



var renderer = PIXI.autoDetectRenderer(256, 256);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);
//Create a container object called the `stage`
var stage = new PIXI.Container();
stage.interactive = true;
stage.rightclick = function (event) {
  var location = event.data.getLocalPosition(map);
  battleship.move(location.x, location.y);
};

var background = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, 3000, 3000);
stage.addChild(background);
var map = new PIXI.Container();
stage.addChild(map);
var ships = new PIXI.Container();

//Tell the `renderer` to `render` the `stage`
renderer.render(stage);

renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

window.onresize = function (event) {
  renderer.resize(window.innerWidth, window.innerHeight);
};
Input.init(renderer, map);

PIXI.loader
  .add([
    "files/images/Human-Battleship.png",
    "files/images/Human-Battlecruiser.png",
    "files/images/1.jpg"
  ])
  .load(setup);


var battleship;
var enemyship;
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
  var spacebg = new PIXI.extras.TilingSprite(PIXI.loader.resources["files/images/1.jpg"].texture, 20000, 20000);
  spacebg.x = -20000;
  spacebg.y = -20000;
  spacebg.scale.x = 2;
  spacebg.scale.y = 2;
  map.addChild(spacebg);
  map.addChild(ships);

  battleship = new Ship(PIXI.loader.resources["files/images/Human-Battleship.png"].texture);
  battleship.ondeath = function () {
    ships.removeChild(battleship);
  }
  ships.addChild(battleship);
  enemyship = new Ship(PIXI.loader.resources["files/images/Human-Battleship.png"].texture);
  enemyship.x = 1000;
  enemyship.y = 1000;
  ships.addChild(enemyship);
  keyA.press = function (event) {
    battleship.rotateLeft();
  };
  keyA.release = function (event) {
    battleship.stopRotation();
  };
  keyD.press = function (event) {
    battleship.rotateRight();
  };
  keyD.release = function (event) {
    battleship.stopRotation();
  };
  keyX.press = function (event) {
    battleship.stop();
  };
  keyShift.press = function (event) {
    battleship.toggleCruise();
  };
  keyF11.press = function (event) {
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
  requestAnimationFrame(update);

}

function update() {
  Time.updateDelta();
  Input.update(renderer, map);
  if (keyW.isDown) {
    battleship.forward();
  }
  if (keyS.isDown) {
    battleship.reverse();
  }
  if (keyQ.isDown) {
    battleship.strafeLeft();
  }
  if (keyE.isDown) {
    battleship.strafeRight();
  }
  requestAnimationFrame(update);

  ships.children.forEach(function (ship) {
    ship.update();
  });
  for (let i = 0; i < ships.children.length; i++) {
    for (var j = i + 1; j < ships.children.length; j++) {
      if (MathUtils.checkCollision(ships.children[i], ships.children[j])) {
        MathUtils.resolveCollision(ships.children[i], ships.children[j]); //might not be completely fair
        ships.children[i].takeDamage(ships.children[j].ramDamage * Time.deltaTime);
        ships.children[j].takeDamage(ships.children[i].ramDamage * Time.deltaTime);
      }
    }
  }

  battleship.update();
  renderer.render(stage);
}