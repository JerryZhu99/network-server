import Ship from "game/ship";
import * as Weapons from "game/data/weapons"

var resources;
export var constructors = {};

export function load(loader) {
    resources = loader.resources;
    loader.add("Battleship", "images/ships/Human-Battleship.png");
    loader.add("Frigate", "images/ships/Human-Frigate.png");
    loader.add("Scout", "images/ships/6.png");
    constructors["Battleship"] = Battleship;
    constructors["Frigate"] = Frigate;
    constructors["Scout"] = Scout;
}
export function saveShip(ship) {
    return {
        ship: ship.className,
        weapons: ship.weapons.map((weapon) => (weapon.className))
    }
}
export function loadShip(data) {
    var constructor = constructors[data.ship] || Battleship;
    var ship = new constructor();
    data.weapons.forEach(function (weapon) {
        if (weapon) ship.weapons.push(Weapons.loadWeapon(weapon, ship));
    }, this);
    return ship;
}

export class Battleship extends Ship {
    constructor() {
        super(resources["Battleship"].texture);
        this.size = 110.0;
        this.acceleration = 40.0;
        this.maxVelocity = 100.0;
        this.minVelocity = -25.0;
        this.maxHealth = 2000;
        this.health = 2000;
    }
}
Battleship.shipName = "Battleship";
Battleship.maxWeapons = 5;


export class Frigate extends Ship {
    constructor() {
        super(resources["Frigate"].texture);
        this.size = 100.0;
        this.acceleration = 20.0;
        this.maxVelocity = 100.0;
        this.minVelocity = -25.0;
        this.maxHealth = 1000;
        this.health = 1000;
    }
}
Frigate.shipName = "Frigate";
Frigate.maxWeapons = 2;


export class Scout extends Ship {
    constructor() {
        super(resources["Scout"].texture);
        this.size = 60.0;
        this.acceleration = 40.0;
        this.turnRate = 2.0;
        this.maxVelocity = 200.0;
        this.minVelocity = -50.0;
        this.maxHealth = 500;
        this.health = 500;
    }
}
Scout.shipName = "Scout";
Scout.maxWeapons = 3;