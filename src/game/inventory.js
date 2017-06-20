import * as Network from "net/network"

export var shipData = {
    ship: "Battleship",
    weapons: []
};

export function init(){
    Network.on("ship inventory", function(data){
        var player = Network.players[data.id];
        player.shipData = data.ship;
    })    
}
export function sync(){
    var player = Network.players.find((p)=>(p.id==Network.id));
    console.log(Network);
    player.shipData = shipData;
    Network.send("ship inventory", {
        id: Network.id,
        ship: shipData
    })
}
