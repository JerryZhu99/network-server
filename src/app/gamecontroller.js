import {
    app
} from "app/app.js";

app.controller("gameController", function ($scope, $location) {
    if (!game.started) {
        $location.path("lobby");
    } else {
        game.show();

    }
});