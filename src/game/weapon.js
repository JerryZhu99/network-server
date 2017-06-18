import * as PIXI from "lib/pixi";
import * as MathUtils from "utils/mathutils";
import * as Time from "utils/time";
import * as GameState from "game/gamestate";

export default class Weapon {
    constructor(parent) {
        this.cooldown = 5;
        this.currentTime = 0;
        this.projectile = null;
        this.firing = false;
        this.parent = parent;
        this.range = 1000;
        this.projectileVelocity = 500;
        this.projectileSize = 25;
        this.damage = 100;
        this.projectiles = 1;
    }

    fireAtTarget(target) {
        if (MathUtils.dist(this.parent, target) < this.range) {
            this.fireAt(MathUtils.angle(this.parent, target));
        }
    }
    fireAtTargetPredicted(target) {
        var vx = target.velocity * Math.cos(target.angle - Math.PI / 2);
        var vy = target.velocity * Math.sin(target.angle - Math.PI / 2);
        var v = this.projectileVelocity;
        var dx = target.x - this.parent.x;
        var dy = target.y - this.parent.y;
        var sqr = (x) => (x * x);
        /*solve quadratic 
        vx^2*t^2+vy^2*t^2-v^2
        +2*vx*dx*t+2*vy*dy*t
        +dx^2+dy^2
        */
        var a = sqr(vx) + sqr(vy) - sqr(v);
        var b = 2 * (vx * dx + vy * dy);
        var c = sqr(dx) + sqr(dy);
        var det = sqr(b) - 4 * a * c;
        if (det > 0) {
            var t1 = (-b + Math.sqrt(det)) / (2 * a);
            var t2 = (-b - Math.sqrt(det)) / (2 * a);
            var min = Math.min(t1, t2);
            var max = Math.max(t1, t2);
            var t;
            if (min <= 0) {
                if (max <= 0) {
                    this.fireAtTarget(target);
                    return;
                } else {
                    t = max;
                }
            } else {
                t = min;
            }
            var predicted = {
                x: target.x + vx * t,
                y: target.y + vy * t
            };
            this.fireAtTarget(predicted);
        } else {
            this.fireAtTarget(target);
        }
    }
    fireAt(direction) {
        this.firing = true;
        this.currentTime = this.cooldown;
        for (var i = 0; i < this.projectiles; i++) {
            var newProjectile = new this.projectile();
            this.initProjectile(newProjectile, i, direction);
            GameState.projectiles.addChild(newProjectile);
        }
    }
    initProjectile(projectile, index, direction) {
        projectile.x = this.parent.x;
        projectile.y = this.parent.y;
        projectile.range = this.range;
        projectile.team = this.parent.team;
        projectile.velocity = this.projectileVelocity;
        projectile.size = this.projectileSize;
        projectile.damage = this.damage;
        projectile.setDirection(direction);
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
            this.fireAtTargetPredicted(nearest);
        } else {
            return;
        }
    }

    update(target, firing) {
        this.currentTime = Math.max(0, this.currentTime - Time.deltaTime);
        if (this.currentTime == 0) {
            if (firing) {
                if (target && target.alive) {
                    this.fireAtTargetPredicted(target);
                } else {
                    this.fireAtNearest();
                }
            }
        }
    }
}