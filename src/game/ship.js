import _ from "./../lib/pixi.js";
import * as MathUtils from "./../utils/mathutils.js";
import * as Time from "./../utils/time.js";
import * as GameState from "./gamestate.js"
import {HealthBar} from "./healthbar.js"

export class Ship extends PIXI.Container {
  constructor(texture) {
    super();
    this.sprite = new PIXI.Sprite(texture);
    this.addChild(this.sprite);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.size = 120.0; // radius
    this.angle = 0.0;
    this.angularVelocity = 0.0;
    this.turnRate = 1.0;
    this.acceleration = 25.0;
    this.velocity = 0.0;
    this.maxVelocity = 100.0;
    this.minVelocity = -25.0;
    this.dest = new PIXI.Point();
    this.hasDest = false;
    this.cruise = false;
    this.cruiseStarting = false;
    this.maxhealth = 1000.0;
    this.health = 1000.0;
    this.ramDamage = 50.0;
    this.weapons = [];
    this.target = null;
    this.healthBar = new HealthBar(this);
    this.team = "neutral";
    this.addChild(this.healthBar);
  }

  move(x, y) {
    this.hasDest = true;
    if (!y) {
      this.dest = x;
      return;
    }
    this.dest.x = x;
    this.dest.y = y;
  }
  toggleCruise() {
    this.braking = false;
    this.cruise = !this.cruise;
    this.cruiseStarting = this.cruise;
    this.checkVelocity();
  }
  stopCruise(){
    this.cruise = false;
    this.cruiseStarting = false;
  }
  forward() {
    if (this.cruiseStarting) {
      return;
    }
    this.braking = false;
    this.velocity += (this.cruise ? this.acceleration * 2 : this.acceleration) * Time.deltaTime;
    this.checkVelocity();
  }
  reverse() {
    if (this.cruiseStarting) {
      this.cruiseStarting = false;
    }
    this.braking = false;
    this.velocity -= this.acceleration * Time.deltaTime;
    this.checkVelocity();
  }
  stop() {
    if (this.cruiseStarting) {
      this.cruiseStarting = false;
    }
    this.angularVelocity = 0;
    this.braking = true;
  }
  brake() {
    if (Math.abs(this.velocity) <= this.acceleration * Time.deltaTime) {
      this.velocity = 0;
      this.braking = false;
    } else if (this.velocity > 0) {
      this.velocity -= this.acceleration * Time.deltaTime;
    } else {
      this.velocity += this.acceleration * Time.deltaTime;
    }
    this.checkVelocity();
  }
  checkVelocity() {
    this.velocity = Math.min(this.cruise ? this.maxVelocity * 2 : this.maxVelocity, this.velocity);
    this.velocity = Math.max(this.cruise ? this.minVelocity * 2 : this.minVelocity, this.velocity);
  }
  rotateLeft() {
    this.hasDest = false;
    this.angularVelocity = -this.turnRate;
  }
  rotateRight() {
    this.hasDest = false;
    this.angularVelocity = this.turnRate;
  }
  stopRotation() {
    this.angularVelocity = 0;
  }
  strafeLeft() {
    this.x += this.velocity * Math.cos(this.angle - Math.PI) * Time.deltaTime;
    this.y += this.velocity * Math.sin(this.angle - Math.PI) * Time.deltaTime;
  }
  strafeRight() {
    this.x += this.velocity * Math.cos(this.angle) * Time.deltaTime;
    this.y += this.velocity * Math.sin(this.angle) * Time.deltaTime;
  }
  fireAt(target) {
    this.stopCruise();
    this.target = target;
    this.firing = true;
  }
  stopFiring(){
    this.target = null;
    this.firing = false;
  }
  takeDamage(amount){
    this.stopCruise();
    this.health -= amount;
    if(this.health <= 0){
      this.kill();
    }
  }
  kill(){
    GameState.ships.removeChild(this);
  }

  update() {

    if (this.cruiseStarting) {
      this.velocity += this.acceleration * Time.deltaTime;
      if (this.velocity == this.maxVelocity) {
        this.cruiseStarting = false;
      }
    }

    if (this.cruise) this.firing = false;
    if (this.hasDest) {
      var destAngle = (Math.atan2(this.dest.y - this.y, this.dest.x - this.x) + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI);
      if (Math.abs(destAngle - this.angle) < this.turnRate * Time.deltaTime || Math.abs(destAngle - this.angle + 2 * Math.PI) < this.turnRate * Time.deltaTime) {
        this.angle = destAngle;
        this.angularVelocity = 0;
      } else if ((this.angle < destAngle && destAngle - this.angle < Math.PI) ||
        (this.angle > destAngle && this.angle - destAngle > Math.PI)) {
        this.angularVelocity = this.turnRate;
      } else {
        this.angularVelocity = -this.turnRate;
      }
    }
    this.angle += this.angularVelocity * Time.deltaTime;
    this.angle = (this.angle + 2 * Math.PI) % (2 * Math.PI);
    this.sprite.rotation = this.angle;
    if (this.braking) {
      this.brake();
    }
    this.x += this.velocity * Math.cos(this.angle - Math.PI / 2) * Time.deltaTime;
    this.y += this.velocity * Math.sin(this.angle - Math.PI / 2) * Time.deltaTime;
    this.checkVelocity();
    if (MathUtils.dist(this, this.dest) < this.velocity * 2) {
      this.hasDest = false;
    }
    this.weapons.forEach(function (weapon) {
      weapon.update(this.target, this.firing);
    }, this);
    this.healthBar.update();
  }
}