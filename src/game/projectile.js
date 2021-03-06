import * as PIXI from "lib/pixi";
import * as MathUtils from "utils/mathutils";
import * as Time from "utils/time";
import * as GameState from "game/gamestate";
export default class Projectile extends PIXI.Sprite {
    constructor(texture) {
        super(texture);
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.size = 50.0; // radius
        this.velocity = 50.0;
        this.range = null; // set by weapon
        this.distanceTravelled = 0;
        this.team = null; //set by weapon
    }
    setTarget(point){
        this.target = point;
        this.angle = Math.atan2(point.y - this.y, point.x - this.x);
        this.rotation = this.angle + Math.PI/2;
    }
    setDirection(angle){
        this.angle = angle;
        this.rotation = this.angle + Math.PI/2;
    }
    update(){
        var displacement = this.velocity * Time.deltaTime;
        this.distanceTravelled += displacement;
        this.x += Math.cos(this.angle) * displacement;
        this.y += Math.sin(this.angle) * displacement;

        if(this.distanceTravelled > this.range){
            this.kill();
        }
    }
    collision(ship){
        this.kill();
    }
    kill(){
        GameState.projectiles.removeChild(this);
    }
}