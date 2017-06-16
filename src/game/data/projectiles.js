import _ from "lib/pixi.js";
import Projectile from "game/projectile.js";



export class StandardProjectile extends Projectile{
    constructor(team, texture){  
        super(texture);
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

