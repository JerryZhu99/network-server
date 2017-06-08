import _ from "./../lib/pixi.js";
import * as MathUtils from "./../utils/mathutils.js";
import * as Time from "./../utils/time.js";
import * as GameState from "./gamestate.js";

export class Weapon{
    constructor(parent){
        this.cooldown = 5;
        this.currentTime = 0;
        this.projectile = null;
        this.firing = false;
        this.parent = parent;
    }
    createProjectile(){
        
    }
    fireAtTarget(target){
        this.fireAt(Math.atan2(target.y - this.parent.y, target.x - this.parent.x));
    }
    fireAt(direction){
        this.firing = true;
        this.currentTime = this.cooldown;
        var newProjectile = this.createProjectile();
        newProjectile.x = this.parent.x;
        newProjectile.y = this.parent.y;
        newProjectile.team = this.parent.team;
        newProjectile.setDirection(direction);
        GameState.projectiles.addChild(newProjectile);
    }

    update(target, firing){
        this.currentTime = Math.max(0,this.currentTime - Time.deltaTime);
        if(this.currentTime == 0){
            if(firing){
                this.fireAtTarget(target);
            }
        }
    }
}
