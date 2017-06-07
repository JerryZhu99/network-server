


const WIDTH = 200;
const HEIGHT = 10;

export class HealthBar extends PIXI.Container{
    constructor(parent){
        super();
        this.x = -WIDTH/2;
        this.y = -HEIGHT/2 - parent.size * 1.5;
        this.parent = parent;
        this.outer = new PIXI.Graphics();
        this.outer.beginFill(0xFF0000);
        this.outer.drawRect(0, 0, WIDTH, HEIGHT);
        this.inner = new PIXI.Graphics();
        this.inner.beginFill(0x00FF00);
        this.inner.drawRect(0, 0, WIDTH, HEIGHT);
        this.addChild(this.outer);
        this.addChild(this.inner);
    }
    update(){
        this.inner.width = this.parent.health/this.parent.maxhealth * WIDTH;
    }
}