import _ from "./../../lib/pixi.js";
import {Projectile} from "./../projectile.js";

export class Rocket extends Projectile{
    constructor(team){  
        super(PIXI.loader.resources["images/projectiles/rocket.png"].texture);
        this.team = team;
        this.damage = 100;
        this.range = 100;
        this.velocity = 20;
        this.pivot.y = 1/6;
    }
    collision(ship){
        if(this.team != ship.team){
            ship.takeDamage(100);
            this.kill();
        }
    }

}
