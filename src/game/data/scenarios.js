import * as Ships from "game/data/ships";
import * as Weapons from "game/data/weapons";
import * as GameState from "game/gamestate";
import * as Network from "net/network";

class Scenario {
    constructor(){};
    load() {
        GameState.ships.removeChildren();
        GameState.projectiles.removeChildren();
    }
    checkFinished(){
        return false;
    }
}

export class RaidScenario extends Scenario {
    load() {
        super.load();
        var length = Network.players.length
        for(var i = 0; i < length; i++) {
            var playerObj = Network.players[i];
            var ship = Ships.loadShip(Network.players[i].shipData);
            ship.team = "friendly";
            ship.x = 0 + Math.cos(i/length*2*Math.PI)*200;
            ship.y = 1000 + Math.sin(i/length*2*Math.PI)*200;
            ship.angle = (i/length*2*Math.PI);
            GameState.ships.addChild(ship);
            playerObj.ship = ship;
            ship.id = playerObj.id;
        }
        console.log(Network.players);

        GameState.setPlayer(Network.id);

        var enemies = 5;
        for(var i = 0; i < enemies; i++) {
            var enemy = Ships.loadShip({
                ship: "Battleship",
                weapons:[
                    "Rockets",
                    "MachineGun"
                ]
            });
            enemy.x = 2000 + Math.cos(i/enemies*2*Math.PI) * 500;
            enemy.y = -2000 + Math.sin(i/enemies*2*Math.PI) * 500;
            enemy.angle = -Math.PI/2;
            enemy.velocity = 50;
            enemy.firing = true;
            enemy.team = "enemy";
            GameState.ships.addChild(enemy);
            enemy.id = "enemy"+i;
        }
        var transport = Ships.loadShip({
            ship:"Frigate"
        });
        transport.x = 2000
        transport.y = -2000
        transport.angle = -Math.PI/2;
        transport.velocity = 50;
        transport.team = "enemy";
        GameState.ships.addChild(transport);
        transport.id = "enemy transport";
        this.transport = transport;
    }
    checkFinished(){
        if(this.transport.alive == false){
            return "success";
        }
        if(this.transport.x < -2000){
            return "failure"
        }
    }
}
export var scenarios = [];
scenarios["raid"] = new RaidScenario();
