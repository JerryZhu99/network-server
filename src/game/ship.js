import * as PIXI from "lib/pixi.js";
import * as MathUtils from "utils/mathutils.js";
import * as Time from "utils/time.js";
import * as GameState from "game/gamestate.js";
import * as Network from "net/network.js";
import HealthBar from "game/healthbar.js"



export default class Ship extends PIXI.Container {
  constructor(texture) {
    super();
    this.id = MathUtils.generateId();
    this.sprite = new PIXI.Sprite(texture);
    this.addChild(this.sprite);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.interactive = true;

    this.size = 120.0; // radius
    this.angle = 0.0;
    this.angularVelocity = 0.0;
    this.turnRate = 1.0;
    this.acceleration = 40.0;
    this.velocity = 0.0;
    this.maxVelocity = 100.0;
    this.minVelocity = -25.0;
    this.dest = new PIXI.Point();
    this.hasDest = false;
    this.cruise = false;
    this.cruiseStarting = false;

    this.maxHealth = 1000.0;
    this.health = 1000.0;
    this.alive = true;

    this.team = "neutral";

    this.ramDamage = 50.0;
    this.weapons = [];
    this.target = null;

    this.healthBar = new HealthBar(this);
    this.addChild(this.healthBar);

  }
  getData() {
    return {
      id: this.id,
      x:this.x,
      y:this.y,
      angle:this.angle,
      angularVelocity: this.angularVelocity,
      velocity: this.velocity,
      hasDest: this.hasDest,
      cruise: this.cruise,
      cruiseStarting: this.cruiseStarting,

      maxHealth: this.maxHealth,
      health: this.health,
      alive: this.alive,
    }
  }
  setData(data) {
    for (var property in data) this[property] = data[property];
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
  stopCruise() {
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
  fireAtNearest() {
    this.stopCruise();
    this.target = null;
    this.firing = true;
  }
  stopFiring() {
    this.target = null;
    this.firing = false;
  }
  takeDamage(amount) {
    this.stopCruise();
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      if(Network.isServer)this.kill();
    }
  }
  kill() {
    if(Network.isServer)Network.send("ship killed", this.id);
    GameState.ships.removeChild(this);
    this.alive = false;
  }

  update() {

    if (this.cruiseStarting) {
      this.velocity += this.acceleration * Time.deltaTime;
      if (this.velocity == this.maxVelocity) {
        this.cruiseStarting = false;
      }
    }

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
      weapon.update(this.target, this.firing && !this.cruise);
    }, this);
    this.healthBar.update();
  }

}