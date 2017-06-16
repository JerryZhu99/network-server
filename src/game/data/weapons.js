import Weapon from "game/weapon.js";
import * as Projectiles from "game/data/projectiles.js";
var resources;
export function load(loader) {
    resources = loader.resources;
    loader.add("Rocket", "images/projectiles/rocket.png");
}
export class RocketLauncher extends Weapon{
    constructor(parent){
        super(parent);
        this.cooldown = 0.5;
        this.range = 2000;
        this.projectileVelocity = 500;
        this.damage = 100;
        this.projectile = class Rocket extends Projectiles.StandardProjectile{
            constructor(team){
                super(team, resources["Rocket"].texture);
            }
        }
    }
}