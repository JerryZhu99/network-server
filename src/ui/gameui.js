import _ from "./../lib/pixi.js";
export var elements;
var style = new PIXI.TextStyle({
        fontFamily: 'Consolas',
        fontSize: 18,
        fill: ['#55ff55'], // gradient
    });
export function init(stage) {
    elements = new PIXI.Container();
    
    stage.addChild(elements);
}
export function update(){
    elements.children.forEach(function(elem){
        if(elem.update)elem.update();
    });
}
export class TextElement extends PIXI.Text{
    constructor(text){
        super(text, style);
    }
    setUpdate(func){
        this.update = func;
        return this;
    }
    location(x, y){
        this.x = x;
        this.y = y;
        return this;
    }
}
export class ImageElement extends PIXI.Sprite{
    constructor(texture){
        super(texture);
    }
    setUpdate(func){
        this.update = func;
        return this;
    }
    location(x, y){
        this.x = x;
        this.y = y;
        return this;
    }
}
