import {Weapon} from "./../weapon.js";
import * as Projectiles from "./projectiles.js";

export class RocketLauncher extends Weapon{
    constructor(parent){
        super(parent);
        this.cooldown = 0.25;
    }
    createProjectile(){
        return new Projectiles.Rocket();
    }
}