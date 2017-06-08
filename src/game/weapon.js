import _ from "./../lib/pixi.js";
import * as MathUtils from "./../utils/mathutils.js";
import * as Time from "./../utils/time.js";
import * as GameState from "./gamestate.js";

export class Weapon {
    constructor(parent) {
        this.cooldown = 5;
        this.currentTime = 0;
        this.projectile = null;
        this.firing = false;
        this.parent = parent;
        this.range = 100;
    }

    fireAtTarget(target) {
        this.fireAt(Math.atan2(target.y - this.parent.y, target.x - this.parent.x));
    }
    fireAt(direction) {
        this.firing = true;
        this.currentTime = this.cooldown;
        var newProjectile = new this.projectile();
        newProjectile.x = this.parent.x;
        newProjectile.y = this.parent.y;
        newProjectile.range = this.range;
        newProjectile.team = this.parent.team;
        newProjectile.setDirection(direction);
        GameState.projectiles.addChild(newProjectile);
    }
    fireAtNearest() {
        var dist = Number.POSITIVE_INFINITY;
        var nearest = null;
        GameState.ships.children.forEach(function (ship) {
            var currentdist = MathUtils.dist(ship, this.parent)
            if (currentdist < dist && ship.team != this.parent.team) {
                nearest = ship;
                dist = currentdist;
            }
        }, this);
        if (nearest) {
            this.fireAtTarget(nearest);
        } else {
            return;
        }
    }

    update(target, firing) {
        this.currentTime = Math.max(0, this.currentTime - Time.deltaTime);
        if (this.currentTime == 0) {
            if (firing) {
                if (target && target.alive) {
                    this.fireAtTarget(target);
                } else {
                    this.fireAtNearest();
                }
            }
        }
    }
}