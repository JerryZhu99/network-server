import _ from "./../lib/pixi.js";
import * as MathUtils from "./../utils/mathutils.js";
import * as Time from "./../utils/time.js"

export var map;
export var ships;
export var projectiles;

export function init(stage) {
    map = new PIXI.Container();
    stage.addChild(map);
    ships = new PIXI.Container();
    projectiles = new PIXI.Container();
    var spacebg = new PIXI.extras.TilingSprite(PIXI.loader.resources["images/backgrounds/1.jpg"].texture, 20000, 20000);
    spacebg.x = -20000;
    spacebg.y = -20000;
    spacebg.scale.x = 2;
    spacebg.scale.y = 2;
    map.addChild(spacebg);
    map.addChild(projectiles);
    map.addChild(ships);
}
export function update() {
    ships.children.forEach(function (ship) {
        ship.update();
    });
    projectiles.children.forEach(function (projectile) {
        projectile.update();
        ships.children.forEach(function (ship) {
            if(ship.team != projectile.team){
                if(MathUtils.checkCollision(ship, projectile)){
                    projectile.collision(ship);
                }
            }
        });
    });
    for (let i = 0; i < ships.children.length; i++) {
        for (var j = i + 1; j < ships.children.length; j++) {
            if (MathUtils.checkCollision(ships.children[i], ships.children[j])) {
                MathUtils.resolveCollision(ships.children[i], ships.children[j]); //might not be completely fair
                if (ships.children[i].team != ships.children[j].team) {
                    ships.children[i].takeDamage(ships.children[j].ramDamage * Time.deltaTime);
                    ships.children[j].takeDamage(ships.children[i].ramDamage * Time.deltaTime);
                }
            }
        }
    }
}