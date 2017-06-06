
var prev = Date.now();
var now = Date.now();
export var deltaTime = 0;

export function getDeltaTime(){
  return deltaTime;
}

export function updateDelta(){
  now = Date.now();
  deltaTime = ((now - prev)/1000);
  prev = now;
}
