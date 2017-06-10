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
}

export class TestScenario extends Scenario {
    load() {
        super.load();
        for(var player in GameState.players) {
            var playerObj = GameState.players[player];
            var ship = new Ships.Battleship();
            ship.team = "friendly";
            ship.weapons.push(new Weapons.RocketLauncher(ship));
            GameState.ships.addChild(ship);
            playerObj.ship = ship;
            ship.id = playerObj.id;
        }
        console.log(GameState.players);

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
export var scenarios = [];
scenarios["test"] = new TestScenario();
