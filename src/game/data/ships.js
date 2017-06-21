import Ship from "game/ship";
import * as Weapons from "game/data/weapons"

var resources;
export var constructors = {};

export function load(loader) {
    resources = loader.resources;
    loader.add("Battleship", "images/ships/Human-Battleship.png");
    loader.add("Frigate", "images/ships/Human-Frigate.png");
    loader.add("Scout", "images/ships/6.png");
}
export function saveShip(ship) {
    return {
        ship: ship.type,
        weapons: ship.weapons.map((weapon) => (weapon.className))
    }
}
export function loadShip(data) {
    let textureName = ships[data.ship].texture;
    let ship = new Ship(resources[textureName].texture);
    Object.assign(ship, ships[data.ship].properties);
    ship.type = data.ship;
    if (data.weapons) {
        data.weapons.forEach(function (weapon) {
            if (weapon) ship.weapons.push(Weapons.loadWeapon(weapon, ship));
        }, this);
    }
    return ship;
}

export var ships = {
    "Battleship": {
        texture: "Battleship",
        shipName: "Battleship",
        maxWeapons: 5,
        properties: {
            size: 110.0,
            acceleration: 40.0,
            maxVelocity: 100.0,
            minVelocity: -25.0,
            maxHealth: 2000,
            health: 2000
        }
    },
    "Frigate": {
        texture: "Frigate",
        shipName: "Frigate",
        maxWeapons: 2,
        properties: {
            size: 100.0,
            acceleration: 20.0,
            maxVelocity: 100.0,
            minVelocity: -25.0,
            maxHealth: 1000,
            health: 1000,
        }
    },
    "Scout": {
        texture: "Scout",
        shipName: "Scout",
        maxWeapons: 3,
        properties: {
            size: 60.0,
            acceleration: 40.0,
            turnRate: 2.0,
            maxVelocity: 200.0,
            minVelocity: -50.0,
            maxHealth: 500,
            health: 500,
        }
    }

}