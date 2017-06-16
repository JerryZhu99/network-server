import _ from "lib/pixi.js";
import Projectile from "game/projectile.js";

var resources;
export function load(loader) {
    resources = loader.resources;
    loader.add("Rocket", "images/projectiles/rocket.png");
    loader.add("Bullet", "images/projectiles/bullet.png");
}
export class StandardProjectile extends Projectile{
    constructor(team, texture){  
        super(texture);
        this.team = team;
        this.damage = 100;
        this.range = 1000;
        this.velocity = 200;
    }
    collision(ship){
        if(this.team != ship.team){
            ship.takeDamage(this.damage);
            this.kill();
        }
    }
}
export class RocketProjectile extends StandardProjectile{
    constructor(team){  
        super(team, resources["Rocket"].texture);
        this.scale.x = 0.5;
        this.scale.y = 0.5;
    }
}
export class BulletProjectile extends StandardProjectile{
    constructor(team){  
        super(team, resources["Bullet"].texture);
        this.scale.x = 0.5;
        this.scale.y = 0.5;
    }
}
