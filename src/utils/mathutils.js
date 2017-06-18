import * as PIXI from "lib/pixi";

export function dist(a, b) {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}
export function angle(from, to){
  return Math.atan2(to.y - from.y, to.x - from.x);
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
  if (checkCollision(a, b)) {
    var distance = dist(a, b);
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    if (distance === 0) {
      a.x -= 0.1;
      b.x += 0.1;
    }
    var diff = (a.size + b.size) - dist(a, b);
    var ratio = diff / dist(a, b);
    a.x += dx * ratio / 2;
    a.y += dy * ratio / 2;
    b.x -= dx * ratio / 2;
    b.y -= dy * ratio / 2;
  }
}
export function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}