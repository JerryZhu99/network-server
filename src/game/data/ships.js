import {
    Ship
} from "game/ship.js";

var resources;
export function load(loader) {
    resources = loader.resources;
    loader.add("Battleship", "images/ships/Human-Battleship.png");
}
export class Battleship extends Ship {

    constructor() {
        super(resources["Battleship"].texture);
        this.size = 120.0; // radius
        this.acceleration = 40.0;
        this.maxVelocity = 100.0;
        this.minVelocity = -25.0;
        this.maxHealth = 2000;
        this.health = 2000;
    }
}