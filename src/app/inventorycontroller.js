import app from "app/app";
import * as Weapons from "game/data/weapons";
import * as Inventory from "game/inventory";

app.controller("inventoryController", function ($scope, $location, $http) {
    $scope.startGame = function () {
        if (game.started) {
            game.show();
            $location.path("game");
        } else {
            game.startGame("raid");
        }
    }

    $scope.equippedWeapons = [];
    var maxWeapons = 5;
    for (var i in Inventory.shipData.weapons) {
        var weapon = Weapons.constructors[Inventory.shipData.weapons[i]];
        $scope.equippedWeapons.push(weapon);
    }
    for (var i = 0; i < maxWeapons; i++) {
        if (!$scope.equippedWeapons[i]) $scope.equippedWeapons[i] = null;
    }
    $scope.weapons = [];
    for (var i in Weapons.constructors) {
        $scope.weapons.push({
            item: Weapons.constructors[i],
            itemName: Weapons.constructors[i].itemName,
            amount: 0
        });
    }
    $scope.weapons[0].amount = 5;
    $scope.weapons[1].amount = 5;
    $scope.collection = $scope.weapons;
    $scope.selected = 0;
    $scope.selectWeapon = function (index) {
        $scope.collection = $scope.weapons;
        $scope.selected = index;
    }
    $scope.unequipWeapon = function (index) {
        $scope.collection = $scope.weapons;
        $scope.selected = index;
        var weapon = $scope.equippedWeapons[index];
        if (weapon != null) {
            $scope.collection.find((i) => (i.itemName = weapon.itemName)).amount++;
            $scope.equippedWeapons[index] = null;
            var weapons = Inventory.shipData.weapons;
            weapons.splice(weapons.indexOf(weapon.name), 1);
            Inventory.sync();
        }
    }
    $scope.equip = function (index) {
        var itemObject = $scope.collection[index];
        if (itemObject.amount > 0) {
            itemObject.amount--;
            var weapon = $scope.equippedWeapons[$scope.selected];
            var weapons = Inventory.shipData.weapons;
            if (weapon) {
                $scope.collection.find((i) => (i.itemName == weapon.itemName)).amount++;
                weapons.splice(weapons.indexOf(weapon.name), 1);
            }
            $scope.equippedWeapons[$scope.selected] = itemObject.item;
            weapons.push(itemObject.item.name);
            Inventory.sync();
            console.log(Inventory.shipData);
            console.log($scope.equippedWeapons);
        }

    }
});