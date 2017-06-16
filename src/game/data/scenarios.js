import * as Ships from "game/data/ships.js";
import * as Weapons from "game/data/weapons.js";
import * as GameState from "game/gamestate.js";
import * as Network from "net/network.js";

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

export class TestScenario extends Scenario {
    load() {
        super.load();
        for(var player in Network.players) {
            var playerObj = Network.players[player];
            var ship = new Ships.Battleship();
            ship.team = "friendly";
            ship.weapons.push(new Weapons.Rockets(ship));
            GameState.ships.addChild(ship);
            playerObj.ship = ship;
            ship.id = playerObj.id;
        }
        console.log(Network.players);

        GameState.setPlayer(Network.id);

        var e1 = new Ships.Battleship();
        e1.x = 1000;
        e1.y = 1000;
        e1.team = "enemy";
        GameState.ships.addChild(e1);
        e1.id = "e1";

        var e2 = new Ships.Battleship();
        e2.x = 1500;
        e2.y = 1000;
        e2.team = "enemy";
        GameState.ships.addChild(e2);
        e2.id = "e2";


        var e3 = new Ships.Battleship();
        e3.x = 2000;
        e3.y = 1000;
        e3.team = "enemy";
        GameState.ships.addChild(e3);
        e3.id = "e3";
    }
}
export class RaidScenario extends Scenario {
    load() {
        super.load();
        var length = Network.players.length
        for(var i = 0; i < length; i++) {
            var playerObj = Network.players[i];
            var ship = new Ships.Battleship();
            ship.team = "friendly";
            ship.x = 0 + Math.cos(i/length*2*Math.PI)*200;
            ship.y = 1000 + Math.sin(i/length*2*Math.PI)*200;
            ship.angle = (i/length*2*Math.PI);
            ship.weapons.push(new Weapons.Rockets(ship));
            ship.weapons.push(new Weapons.MachineGun(ship));
            GameState.ships.addChild(ship);
            playerObj.ship = ship;
            ship.id = playerObj.id;
        }
        console.log(Network.players);

        GameState.setPlayer(Network.id);

        var enemies = 5;
        for(var i = 0; i < enemies; i++) {
            var enemy = new Ships.Battleship();
            enemy.x = 2000 + Math.cos(i/enemies*2*Math.PI) * 500;
            enemy.y = -2000 + Math.sin(i/enemies*2*Math.PI) * 500;
            enemy.angle = -Math.PI/2;
            enemy.velocity = 50;
            enemy.firing = true;
            enemy.team = "enemy";
            enemy.weapons.push(new Weapons.Rockets(enemy));
            GameState.ships.addChild(enemy);
            enemy.id = "enemy"+i;
        }
        var transport = new Ships.Frigate();
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
scenarios["test"] = new TestScenario();
scenarios["raid"] = new RaidScenario();
