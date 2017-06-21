import * as Network from "net/network"

export var ownedShips = [{
    ship: "Battleship",
    weapons: []
}, {
    ship: "Scout",
    weapons: []
}];

export var currentShip = 0;

export function useShip(index) {
    currentShip = index;
}

export function shipData(index = currentShip) {
    return ownedShips[index];
}

export function init() {
    Network.on("ship inventory", function (data) {
        var player = Network.players.find((p) => (p.id == data.id));
        player.shipData = data.ship;
    })
}
export function sync() {
    var player = Network.players.find((p) => (p.id == Network.id));
    console.log(Network);
    player.shipData = ownedShips[currentShip];
    Network.send("ship inventory", {
        id: Network.id,
        ship: ownedShips[currentShip]
    })
}