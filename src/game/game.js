import * as PIXI from "lib/pixi.js";
import * as Time from "utils/time.js";
import * as Keyboard from "input/keyboard.js";
import * as Settings from "utils/settings.js"
import * as Input from "input/input.js";
import * as MathUtils from "utils/mathutils.js";
import * as GameState from "game/gamestate.js";
import * as Weapons from "game/data/weapons.js";
import * as Ships from "game/data/ships.js";
import * as Projectiles from "game/data/projectiles.js";
import * as GameUI from "ui/gameui.js";
import * as Network from "net/network.js";

export function connect(id){
  Network.connect(id);
}
export function loadScenario(name){
  GameState.loadScenario(name);
  show();
}
export function hide(){
  Input.deactivate();
  renderer.view.classList.add("hidden");
}
export function show(){
  Input.activate();
  renderer.view.classList.remove("hidden");
}
var renderer = PIXI.autoDetectRenderer(256, 256);

//Add the canvas to the HTML document
document.querySelector("#game").appendChild(renderer.view);
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
GameState.load(PIXI.loader);
Ships.load(PIXI.loader);
Projectiles.load(PIXI.loader);

PIXI.loader.load(setup);


function setup() {
  GameState.init(stage);
  GameUI.init(stage);
  Input.init(renderer, stage);
  Network.init();
  requestAnimationFrame(update);

}

function update() {
  Time.updateDelta();
  Input.update(renderer, stage);
  
  GameUI.update();
  requestAnimationFrame(update);

  GameState.update();

  renderer.render(stage);
}
