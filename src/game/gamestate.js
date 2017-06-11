import _ from "lib/pixi.js";
import * as MathUtils from "utils/mathutils.js";
import * as Time from "utils/time.js";
import * as Network from "net/network.js"
import {
    Ship
} from "game/ship.js";
import * as Ships from "game/data/ships.js";
import * as Weapons from "game/data/weapons.js";

import * as Scenarios from "game/data/scenarios.js";

export var map;
export var ships;
export var projectiles;
export var player;
export var players = [];


var resources;
export function load(loader) {
    resources = loader.resources;
    loader.add("Background", "images/backgrounds/1.jpg");
}
export function addPlayer(id) {
    console.log('new player added');
    players.push({
        id: id
    });
}
export function setPlayer(id) {
    player = players.find((p) => (p.id == id)).ship;
}
export function getPlayer(id) {
    return players.find((p) => (p.id == id)).ship;
}
export function init(stage) {
    Network.addHandler("join game", function (data) {
        console.log("join request received from: " + data);
        addPlayer(data);
        players.sort()
        Scenarios.scenarios["test"].load();
        console.log("players:" + (players));
        Network.sendMessage("load scenario", {
            players: players.map((p) => (p.id)),
            scenario: "test"
        });
    });
    Network.addHandler("load scenario", function (data) {
        players = [];
        for (let playerId of data.players) {
            addPlayer(playerId)
        }
        players.sort();
        Scenarios.scenarios[data.scenario].load();
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

    Network.ready(function () {
        addPlayer(Network.id);
        (new Scenarios.TestScenario()).load();
    });
}
export function loadScenario(name) {
    if (Network.isServer) {
        Scenarios.scenarios[name].load();
        Network.sendMessage("load scenario", {
            players: players.map((p) => (p.id)),
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