import _ from "./pixi.js";
import * as MathUtils from "./mathutils.js";
import * as Time from "./time.js";

export class Ship extends PIXI.Sprite {
  constructor(texture){
    super(texture);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.rotation = 0;
    this.angularVelocity = 0;
    this.turnRate = 1;
    this.acceleration = 25;
    this.velocity = 0;
    this.maxVelocity = 100;
    this.minVelocity = -25;
    this.dest = new PIXI.Point();
    this.hasDest = false;
    this.cruise = false;
    this.cruiseStarting = false;
  }

  move(x,y){
    this.hasDest = true;
    if(!y){
      this.dest = x;
      return;
    }
    this.dest.x=x;
    this.dest.y=y;
  }
  toggleCruise(){
    this.braking = false;
    this.cruise = !this.cruise;
    this.cruiseStarting = this.cruise;
    this.checkVelocity();
  }
  forward(){
    if(this.cruiseStarting){
      return;
    }
    this.braking = false;
    this.velocity += (this.cruise?this.acceleration*2:this.acceleration) * Time.deltaTime;
    this.checkVelocity();
  }
  reverse(){
    if(this.cruiseStarting){
      this.cruiseStarting = false;
    }
    this.braking = false;
    this.velocity -= this.acceleration * Time.deltaTime;
    this.checkVelocity();
  }
  stop(){
    if(this.cruiseStarting){
      this.cruiseStarting = false;
    }
    this.angularVelocity = 0;
    this.braking = true;
  }
  brake(){
    if(Math.abs(this.velocity) <= this.acceleration * Time.deltaTime){
      this.velocity = 0;
      this.braking = false;
    }else if(this.velocity > 0){
      this.velocity -= this.acceleration * Time.deltaTime;
    }else{
      this.velocity += this.acceleration * Time.deltaTime;
    }
    this.checkVelocity();
  }
  checkVelocity(){
    this.velocity = Math.min(this.cruise?this.maxVelocity*2:this.maxVelocity, this.velocity);
    this.velocity = Math.max(this.cruise?this.minVelocity*2:this.minVelocity, this.velocity);
  }
  rotateLeft(){
    this.hasDest = false;
    this.angularVelocity = -this.turnRate;
  }
  rotateRight(){
    this.hasDest = false;
    this.angularVelocity = this.turnRate;
  }
  stopRotation(){
    this.angularVelocity = 0;
  }
  strafeLeft(){
    this.x += this.velocity * Math.cos(this.rotation - Math.PI) * Time.deltaTime;
    this.y += this.velocity * Math.sin(this.rotation - Math.PI) * Time.deltaTime;
  }
  strafeRight(){
    this.x += this.velocity * Math.cos(this.rotation) * Time.deltaTime;
    this.y += this.velocity * Math.sin(this.rotation) * Time.deltaTime;
  }
  update(){
    if(this.cruiseStarting){
      this.velocity += this.acceleration * Time.deltaTime;
      this.checkVelocity();
      if( this.velocity == this.maxVelocity){
         this.cruiseStarting = false;
      }
    }
    if(this.hasDest){
      var destAngle = (Math.atan2(this.dest.y-this.y,this.dest.x-this.x ) + Math.PI/2 + 2*Math.PI)%(2*Math.PI);
      if(Math.abs(destAngle - this.rotation) < this.turnRate * Time.deltaTime || Math.abs(destAngle - this.rotation + 2*Math.PI) < this.turnRate * Time.deltaTime){
        this.rotation = destAngle;
        this.angularVelocity = 0;
      }else if((this.rotation < destAngle && destAngle - this.rotation < Math.PI)||
      (this.rotation > destAngle && this.rotation - destAngle > Math.PI)){
        this.angularVelocity = this.turnRate;
      }else{
        this.angularVelocity = -this.turnRate;
      }
    }
    this.rotation += this.angularVelocity * Time.deltaTime;
    this.rotation = (this.rotation + 2*Math.PI)%(2*Math.PI);
    if(this.braking){
      this.brake();
    }
    this.x += this.velocity * Math.cos(this.rotation - Math.PI/2) * Time.deltaTime;
    this.y += this.velocity * Math.sin(this.rotation - Math.PI/2) * Time.deltaTime;
    if(MathUtils.dist(this, this.dest) < this.velocity*2){
      this.hasDest = false;
    }
  }
}
