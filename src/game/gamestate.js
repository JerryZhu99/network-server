import _ from "lib/pixi";
import * as MathUtils from "utils/mathutils";
import * as Time from "utils/time";
import * as Network from "net/network"
import {
    Ship
} from "game/ship";
import * as Ships from "game/data/ships";
import * as Weapons from "game/data/weapons";

import * as Scenarios from "game/data/scenarios";

export var map;
export var ships;
export var projectiles;
export var player;
var scenario;

var resources;
export function load(loader) {
    resources = loader.resources;
    loader.add("Background", "images/backgrounds/1.jpg");
}

export function setPlayer(id) {
    player = getPlayer(id);
}
export function getPlayer(id) {
    return Network.players.find((p) => (p.id == id)).ship;
}
export function init(stage) {
    Network.addHandler("load scenario", function (data) {
        scenario = Scenarios.scenarios[data.scenario]
        scenario.load();
//        Network.players = data.players;
    })
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
}
export function loadScenario(name) {
    if (Network.isServer) {
        scenario = Scenarios.scenarios[name];
        scenario.load();
        Network.sendMessage("load scenario", {
            scenario: name
        });
    }
}

export function getShip(id) {
    return ships.children.find((ship) => (ship.id == id))
}
Network.on("ship update", function (data) {
    var s = getShip(data.id)
    if (s) s.setData(data);
});
Network.on("ship killed", function(id){
  getShip(id).kill();
});
var counter = 0;
export function update() {
    ships.children.forEach(function (ship) {
        ship.update();
        if (counter++ > 60 && Network.isServer) {
            counter = 0;
            Network.send("ship update", ship.getData());
        }
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
export function checkFinished(callback){
    var finished = false;
    if(scenario)finished = scenario.checkFinished();
    var playersAlive = Network.players.some(function(player){
        return player.ship.alive;
    })
    if(!playersAlive){
        finished = "failure";
    }
    return finished;
}