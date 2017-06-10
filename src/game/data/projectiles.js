import _ from "lib/pixi.js";
import {Projectile} from "game/projectile.js";

var resources;
export function load(loader) {
    resources = loader.resources;
    loader.add("Rocket", "images/projectiles/rocket.png");
}

export class Rocket extends Projectile{
    constructor(team){  
        super(resources["Rocket"].texture);
        this.team = team;
        this.damage = 100;
        this.range = 100;
        this.velocity = 20;
    }
    collision(ship){
        if(this.team != ship.team){
            ship.takeDamage(this.damage);
            this.kill();
        }
    }

}
