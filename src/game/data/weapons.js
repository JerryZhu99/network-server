import Weapon from "game/weapon.js";
import * as Projectiles from "game/data/projectiles.js";

export class Rockets extends Weapon{
    constructor(parent){
        super(parent);
        this.cooldown = 5;
        this.range = 2000;
        this.projectileVelocity = 500;
        this.damage = 100;
        this.projectile = Projectiles.RocketProjectile;
    }
}
export class MachineGun extends Weapon{
    constructor(parent){
        super(parent);
        this.cooldown = 0.1;
        this.range = 1000;
        this.projectileVelocity = 2000;
        this.damage = 25;
        this.projectile = Projectiles.BulletProjectile;
        this.projectileSize = 25;
        this.projectiles = 2;
    }
    initProjectile(projectile, index, direction){
        super.initProjectile(projectile, index, direction);
        var pos = index-(this.projectiles-1)/2;
        projectile.x += Math.sin(direction)*projectile.size*pos;
        projectile.y -= Math.cos(direction)*projectile.size*pos;
    }
}