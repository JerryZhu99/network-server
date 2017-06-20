import Ship from "game/ship";
import * as Weapons from "game/data/weapons"

var resources;
export function load(loader) {
    resources = loader.resources;
    loader.add("Battleship", "images/ships/Human-Battleship.png");
    loader.add("Frigate", "images/ships/Human-Frigate.png");
}
export function saveShip(ship) {
    return {
        ship: ship.className,
        weapons: ship.weapons.map((weapon) => (weapon.className))
    }
}
export function loadShip(data) {
    console.log(data);
    var constructor = Battleship;
    switch(data.ship){
        case "Battleship":
            constructor = Battleship;
            break;
        case "Frigate":
            constructor = Frigate;
            break;
    }
    var ship = new constructor();
    data.weapons.forEach(function (weapon) {
        if(weapon)ship.weapons.push(Weapons.loadWeapon(weapon, ship));
    }, this);
    return ship;
}
export class Battleship extends Ship {

    constructor() {
        super(resources["Battleship"].texture);
        this.size = 110.0; // radius
        this.acceleration = 40.0;
        this.maxVelocity = 100.0;
        this.minVelocity = -25.0;
        this.maxHealth = 2000;
        this.health = 2000;
    }
}
export class Frigate extends Ship {

    constructor() {
        super(resources["Frigate"].texture);
        this.size = 100.0; // radius
        this.acceleration = 20.0;
        this.maxVelocity = 100.0;
        this.minVelocity = -25.0;
        this.maxHealth = 1000;
        this.health = 1000;
    }
}