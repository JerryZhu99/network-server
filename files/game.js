var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

var renderer = autoDetectRenderer(256, 256);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new Container();
stage.interactive = true;
stage.click = function(event){
  battleship.move(event.data.global.x,event.data.global.y);
};
background = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, 3000, 3000);
stage.addChild(background)
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
var battleship;

function setup() {
  battleship = new Sprite(resources["files/images/Human-Battleship.png"].texture);
  battleship.anchor.x = 0.5;
  battleship.anchor.y = 0.5;
  battleship.move = function(x,y){
    this.x=x;
    this.y=y;
  }
  stage.addChild(battleship);
  requestAnimationFrame(gameLoop);

}
var prev = Date.now();

function gameLoop() {
  var now = Date.now();
  var deltaTime = now - prev;
  prev = now;

  //Loop this function at 60 frames per second
  requestAnimationFrame(gameLoop);

  //Move the cat 1 pixel to the right each frame
  battleship.x += deltaTime/1000*60;

  //Render the stage to see the animation
  renderer.render(stage);
}
