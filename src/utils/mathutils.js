import _ from "./../lib/pixi.js";

export function dist(a, b) {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}
/**
 * 
 * @param {*} a 
 * @param {*} b 
 * @param {function(boolean)} callback 
 */
export function checkCollision(a, b, callback) {
  return (dist(a, b) < a.size + b.size);
}


export function resolveCollision(a, b) {
  if (checkCollision(a,b)) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var diff = (a.size + b.size) - dist(a, b);
    var ratio = diff / dist(a, b);
    a.x += dx * ratio / 2;
    a.y += dy * ratio / 2;
    b.x -= dx * ratio / 2;
    b.y -= dy * ratio / 2;
  }
}