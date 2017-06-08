import _ from "./../lib/pixi.js";
import * as MathUtils from "./../utils/mathutils.js";
import * as Time from "./../utils/time.js";
import {
    Ship
} from "./ship.js";
import * as Ships from "./data/ships.js";
import * as Weapons from "./data/weapons.js";

export var map;
export var ships;
export var projectiles;
export var player;

var resources;
export function load(loader) {
    resources = loader.resources;
    loader.add("Background", "images/backgrounds/1.jpg");
}

export function init(stage) {
    map = new PIXI.Container();
    stage.addChild(map);
    ships = new PIXI.Container();
    projectiles = new PIXI.Container();
    var spacebg = new PIXI.extras.TilingSprite(resources["Background"].texture, 20000, 20000);
    spacebg.x = -20000;
    spacebg.y = -20000;
    spacebg.scale.x = 2;
    spacebg.scale.y = 2;
    map.addChild(spacebg);
    map.addChild(projectiles);
    map.addChild(ships);

    player = new Ships.Battleship();;
    player.team = "friendly";
    player.weapons.push(new Weapons.RocketLauncher(player));
    ships.addChild(player);


    var e1 = new Ships.Battleship();
    e1.x = 1000;
    e1.y = 1000;
    e1.team = "enemy";
    ships.addChild(e1);

    var e2 = new Ships.Battleship();
    e2.x = 1500;
    e2.y = 1000;
    e2.team = "enemy";
    ships.addChild(e2);

    var e3 = new Ships.Battleship();
    e3.x = 2000;
    e3.y = 1000;
    e3.team = "enemy";
    ships.addChild(e3);
}
export function update() {
    ships.children.forEach(function (ship) {
        ship.update();
    });
    projectiles.children.forEach(function (projectile) {
        projectile.update();
        ships.children.forEach(function (ship) {
            if (ship.team != projectile.team) {
                if (MathUtils.checkCollision(ship, projectile)) {
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