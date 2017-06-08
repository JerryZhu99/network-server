import _ from "./lib/pixi.js";

import * as Time from "./utils/time.js";

import * as Keyboard from "./input/keyboard.js";

import * as Settings from "./utils/settings.js"

import * as Input from "./input/input.js"

import * as MathUtils from "./utils/mathutils.js"

import * as GameState from "./game/gamestate.js"

import * as Weapons from "./game/data/weapons.js"

import * as GameUI from "./ui/gameui.js"

import {
  Ship
} from "./game/ship.js";



var renderer = PIXI.autoDetectRenderer(256, 256);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);
//Create a container object called the `stage`
var stage = new PIXI.Container();
stage.interactive = true;


var background = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, 3000, 3000);
stage.addChild(background);


//Tell the `renderer` to `render` the `stage`
renderer.render(stage);

renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

window.onresize = function (event) {
  renderer.resize(window.innerWidth, window.innerHeight);
};
Input.init(renderer);

PIXI.loader
  .add([
    "images/ships/Human-Battleship.png",
    "images/ships/Human-Battlecruiser.png",
    "images/backgrounds/1.jpg",
    "images/projectiles/rocket.png"
  ])
  .load(setup);


var player;
var targeting = false;
var enemyship;
var keyW = Keyboard.key(Keyboard.keyCode("W"));
var keyA = Keyboard.key(Keyboard.keyCode("A"));
var keyS = Keyboard.key(Keyboard.keyCode("S"));
var keyD = Keyboard.key(Keyboard.keyCode("D"));
var keyX = Keyboard.key(Keyboard.keyCode("X"));
var keyQ = Keyboard.key(Keyboard.keyCode("Q"));
var keyE = Keyboard.key(Keyboard.keyCode("E"));
var keyF = Keyboard.key(Keyboard.keyCode("F"));
var keyZ = Keyboard.key(Keyboard.keyCode("Z"));

var keyShift = Keyboard.key(16);
var keyF11 = Keyboard.key(122);

function setup() {
  GameState.init(stage);
  GameUI.init(stage);
  player = new Ship(PIXI.loader.resources["images/ships/Human-Battleship.png"].texture);
  player.team = "friendly";
  player.weapons.push(new Weapons.RocketLauncher(player));
  GameUI.elements.addChild(
    new GameUI.TextElement()
    .setUpdate(function () {
      this.text = (`Cruise: ${player.cruise?"on":"off"}`);
    })
    .location(30, 30)
  );
  GameUI.elements.addChild(
    new GameUI.TextElement()
    .setUpdate(function () {
      this.text = (`Weapons: ${player.firing?"on":"off"}`);
    })
    .location(30, 60)
  );
    GameUI.elements.addChild(
    new GameUI.TextElement()
    .setUpdate(function () {
      this.text = (`Speed: ${player.velocity.toFixed(1)}`);
    })
    .location(30, 90)
  );
  GameState.ships.addChild(player);
  enemyship = new Ship(PIXI.loader.resources["images/ships/Human-Battleship.png"].texture);
  enemyship.x = 1000;
  enemyship.y = 1000;
  enemyship.team = "enemy";
  GameState.ships.addChild(enemyship);
  keyA.press = function (event) {
    player.rotateLeft();
  };
  keyA.release = function (event) {
    player.stopRotation();
  };
  keyD.press = function (event) {
    player.rotateRight();
  };
  keyD.release = function (event) {
    player.stopRotation();
  };
  keyX.press = function (event) {
    player.stop();
  };
  keyShift.press = function (event) {
    player.toggleCruise();
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
  keyF.press = function (event) {
    targeting = !targeting;
  };
  stage.click = function (event) {
    if (targeting) {
      var location = event.data.getLocalPosition(GameState.map);
      player.fireAtNearest(); 
      targeting = false;
    }
  };
  Ship.click = function (event) {
    if (targeting) {
      player.fireAt(this);
      targeting = false;
    }
    event.stopPropagation();
  };
  stage.rightclick = function (event) {
    var location = event.data.getLocalPosition(GameState.map);
    player.move(location.x, location.y);
    targeting = false;
  };
  keyZ.press = function (event) {
    targeting = false;
    player.stopFiring();
  };
  requestAnimationFrame(update);

}

function update() {
  Time.updateDelta();
  Input.update(renderer);
  stage.cursor = targeting ? "crosshair" : "default";
  if (keyW.isDown) {
    player.forward();
  }
  if (keyS.isDown) {
    player.reverse();
  }
  if (keyQ.isDown) {
    player.strafeLeft();
  }
  if (keyE.isDown) {
    player.strafeRight();
  }
  GameUI.update();
  requestAnimationFrame(update);

  GameState.update();

  renderer.render(stage);
}