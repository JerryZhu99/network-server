import {Weapon} from "game/weapon.js";
import * as Projectiles from "game/data/projectiles.js";

export class RocketLauncher extends Weapon{
    constructor(parent){
        super(parent);
        this.cooldown = 0.25;
        this.range = 100;
        this.projectile = Projectiles.Rocket;
    }

}