import * as Settings from "./../utils/settings.js";
import * as Time from "./../utils/time.js";
import * as GameState from "./../game/gamestate.js"
export function init(renderer) {
  document.addEventListener("wheel", function (event) {
    var map = GameState.map;
    let zoomIn = event.deltaY < 0; //simplified
    let zoomFactor;
    if (zoomIn) {
      zoomFactor = 1.1;
    } else {
      zoomFactor = (1 / 1.1);
    }
    let original = map.scale.x;
    //zoom
    map.scale.x *= zoomFactor;
    map.scale.y *= zoomFactor;
    //restrict zoom
    map.scale.x = Math.max(Settings.MINZOOM, map.scale.x);
    map.scale.x = Math.min(Settings.MAXZOOM, map.scale.x);
    map.scale.y = Math.max(Settings.MINZOOM, map.scale.y);
    map.scale.y = Math.min(Settings.MAXZOOM, map.scale.y);

    zoomFactor = map.scale.x / original;
    //center on cursor
    map.x -= (window.innerWidth / 2 - map.x) * (zoomFactor - 1);
    map.y -= (window.innerHeight / 2 - map.y) * (zoomFactor - 1);

    correct();

    event.preventDefault();
  }, false);

  function correct() {
    var map = GameState.map;

    //keep aspect ratio
    if (map.scale.y != map.scale.x) {
      map.scale.x = Math.max(map.scale.x, map.scale.y);
      map.scale.y = Math.max(map.scale.x, map.scale.y);
    }
  }
}
export function update(renderer) {
  var map = GameState.map;
  if (renderer.plugins.interaction.eventData.data) {
    let mouseLocation = renderer.plugins.interaction.eventData.data.global;
    if (mouseLocation.x < 0 ||
      mouseLocation.x > window.innerWidth ||
      mouseLocation.y < 0 ||
      mouseLocation.y > window.innerHeight) {
      return;
    }
    if (mouseLocation.x < Settings.BORDER) {
      map.x += map.scale.x * Time.deltaTime * Settings.SCROLLSPEED;
    }
    if (mouseLocation.x > window.innerWidth - Settings.BORDER) {
      map.x -= map.scale.x * Time.deltaTime * Settings.SCROLLSPEED;
    }
    if (mouseLocation.y < Settings.BORDER) {
      map.y += map.scale.y * Time.deltaTime * Settings.SCROLLSPEED;
    }
    if (mouseLocation.y > window.innerHeight - Settings.BORDER) {
      map.y -= map.scale.y * Time.deltaTime * Settings.SCROLLSPEED;
    }
  }
}