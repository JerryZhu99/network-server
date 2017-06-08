import {Weapon} from "./../weapon.js";
import * as Projectiles from "./projectiles.js";

export class RocketLauncher extends Weapon{
    constructor(parent){
        super(parent);
        this.cooldown = 0.25;
        this.range = 100;
        this.projectile = Projectiles.Rocket;
    }

}