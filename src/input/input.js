import * as Settings from "utils/settings.js";
import * as Time from "utils/time.js";
import * as GameState from "game/gamestate.js";
import * as Keyboard from "input/keyboard.js";
import * as Network from "net/network.js";
import {
  Ship
} from "game/ship.js";

var keyW = Keyboard.key(Keyboard.keyCode("W"));
var keyA = Keyboard.key(Keyboard.keyCode("A"));
var keyS = Keyboard.key(Keyboard.keyCode("S"));
var keyD = Keyboard.key(Keyboard.keyCode("D"));
var keyX = Keyboard.key(Keyboard.keyCode("X"));
var keyQ = Keyboard.key(Keyboard.keyCode("Q"));
var keyE = Keyboard.key(Keyboard.keyCode("E"));
var keyF = Keyboard.key(Keyboard.keyCode("F"));
var keyZ = Keyboard.key(Keyboard.keyCode("Z"));
var keyShift = Keyboard.key(16);
var keyF11 = Keyboard.key(122);
var keyN = Keyboard.key(Keyboard.keyCode("N"));

var targeting = false;

export var active = true;
export function activate(){
  active = true;
  Keyboard.activate();
}
export function deactivate(){
  active = false;
  Keyboard.deactivate();
}

export function init(renderer, stage) {
  Network.addHandler("stop", (data) => {
    console.log(data)
  });
  document.addEventListener("wheel", function (event) {
    if(!active)return;
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
  Network.on("rotate left", function (id) {
    GameState.getPlayer(id).rotateLeft();
  });
  Network.on("stop rotation", function (id) {
    GameState.getPlayer(id).stopRotation();
  });
  Network.on("rotate right", function (id) {
    GameState.getPlayer(id).rotateRight();
  });
  keyA.press = function (event) {
    GameState.player.rotateLeft();
    Network.send("rotate left", Network.id);
  };

  keyA.release = function (event) {
    GameState.player.stopRotation();
    Network.send("stop rotation", Network.id);
  };
  keyD.press = function (event) {
    GameState.player.rotateRight();
    Network.send("rotate right", Network.id);
  };
  keyD.release = function (event) {
    GameState.player.stopRotation();
    Network.send("stop rotation", Network.id);
  };
  Network.on("stop", function (id) {
    GameState.getPlayer(id).stop();
  });
  keyX.press = function (event) {
    GameState.player.stop();
    Network.send("stop", Network.id);
  };
  Network.on("toggle cruise", function (id) {
    GameState.getPlayer(id).toggleCruise();
  });
  keyShift.press = function (event) {
    GameState.player.toggleCruise();
    Network.send("toggle cruise", Network.id);
  };
  keyF11.press = function (event) {
    if (document.body.requestFullscreen) {
      document.body.requestFullscreen();
    } else if (document.body.webkitRequestFullscreen) {
      document.body.webkitRequestFullscreen();
    } else if (document.body.mozRequestFullScreen) {
      document.body.mozRequestFullScreen();
    } else if (document.body.msRequestFullscreen) {
      document.body.msRequestFullscreen();
    }
    renderer.resize(window.innerWidth, window.innerHeight);

  };
  keyF.press = function (event) {
    targeting = !targeting;
  };
  Network.on("fire at nearest", function (id) {
    GameState.getPlayer(id).fireAtNearest();
  });
  stage.click = function (event) {
    if (targeting) {
      var location = event.data.getLocalPosition(GameState.map);
      GameState.player.fireAtNearest();
      Network.send("fire at nearest", Network.id);
      targeting = false;
    }
  };
  Network.on("fire at", function (data) {
    GameState.getPlayer(data.id).fireAt(GameState.getShip(data.target));
  });
  GameState.ships.interactive = true;
  GameState.ships.click = function (event) {
    if (targeting && event.target.team != GameState.player.team) {
      GameState.player.fireAt(event.target);
      Network.send("fire at", {id:Network.id, target:event.target.id});
      targeting = false;
    }
    event.stopPropagation();
  };
  Network.on("move", function (data) {
    GameState.getPlayer(data.id).move(data.x, data.y);
  });
  stage.rightclick = function (event) {
    var location = event.data.getLocalPosition(GameState.map);
    GameState.player.move(location.x, location.y);
    Network.send("move", {
      id: Network.id,
      x: location.x,
      y: location.y
    });
    targeting = false;
  };
  Network.on("stop firing", function (id) {
    GameState.getPlayer(id).stopFiring();
  });
  keyZ.press = function (event) {
    targeting = false;
    GameState.player.stopFiring();
    Network.send("stop firing", Network.id);
  };
  keyN.press = function (event) {
    Network.connect(prompt("Client Id"));
  }

}
Network.on("forward", function (id) {
  GameState.getPlayer(id).forward();
});
Network.on("reverse", function (id) {
  GameState.getPlayer(id).reverse();
});
Network.on("strafe left", function (id) {
  GameState.getPlayer(id).strafeLeft();
});
Network.on("strafe right", function (id) {
  GameState.getPlayer(id).strafeRight();
});
export function update(renderer, stage) {
  if(!active)return;
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
  map.parent.cursor = targeting ? "crosshair" : "default";
  if (keyW.isDown) {
    GameState.player.forward();
    Network.send("forward", Network.id);
  }
  if (keyS.isDown) {
    GameState.player.reverse();
    Network.send("reverse", Network.id);
  }
  if (keyQ.isDown) {
    GameState.player.strafeLeft();
    Network.send("strafe left", Network.id);
  }
  if (keyE.isDown) {
    GameState.player.strafeRight();
    Network.send("strafe right", Network.id);
  }
}