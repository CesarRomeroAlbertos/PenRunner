PenRunner.scoreWSState = function (game) { }


PenRunner.scoreWSState.prototype =
    {
        create: function () {
            var message = {
				type: "score"
			};
			ws.send(JSON.stringify(message));
            var background = game.add.sprite(game.world.x, game.world.y - 25, 'backgroundScore'); //Añadimos un sprite al background
            background.scale.setTo(0.65, 1); //Escalamos la imagen del background
            var buttonReturn = game.add.button(game.world.x + 42, game.world.y + 40, 'return', this.actionONClickScore, this, 0, 0, 0); //Botón para volver al menú principal

            //Escalamos el boton de volver atrás
            buttonReturn.width = 35;
            buttonReturn.height = 40;
            scoreMusic = game.add.audio('scoreMusic');
            scoreMusic.play();
            //Texto de la puntuación final.
            var text = game.add.text(game.world.centerX - 222, game.world.centerY - 275, 'Puntuación Final', style5);
        },
        //Cuando llamamos a esta función devolvemos una lista con todos los jugadores de la partida, ordenados por la puntuación que han obtenido en la partida,
        //es decir, en función de cuando hayan llegado a la meta, se les asigna una puntuación, y, en función de eso, se les ordena e imprime en la pantalla

        updatePlayers: function (callback) {
            $.ajax({
                method: "GET",
                url: 'http://localhost:8080/players/score',
                processData: false,
                headers: {
                    "Content-Type": "application/json"
                }
            }).done(function (data) {
                game.scoreData = JSON.parse(JSON.stringify(data));
                callback(data);
            })
        },
        //esta función borra a los jugadores de la partida
        deletePlayer: function (id) {
            $.ajax({
                method: "DELETE",
                url: 'http://localhost:8080/player/',
                processData: false,
                headers: {
                    "Content-Type": "application/json"
                },
            }).done(function (data) {
             //   console.log('Se ha borrado el jugador' + JSON.stringify(data));
            })
        },

        sendPlayerUpdate: function () {
            $.ajax({
                method: "PUT",
                url: 'http://localhost:8080/player/' + playerId,
                data: JSON.stringify(game.player),
                processData: false,
                headers: {
                    "Content-Type": "application/json"
                }
            }).done(function (data) { })
        },
        
        getNumPlayers: function () {
            $.ajax({
                url: 'http://localhost:8080/player/number',
            }).done(function (data) {
                game.numPlayers = JSON.parse(JSON.stringify(data));
              //  console.log(game.numPlayers);
            })
        },

        updatePlayers: function () {
            for (var i = 0; i < game.numPlayers; i++) {
                var jugador = game.add.sprite(game.world.x + 34, game.world.y + (110 + 80 * i) , 'jugador');
                jugador.scale.setTo(1.6, 0.8);
                //Aquí imprimimos el texto que dice la puntuación y el jugador correspondiente, ya ordenado
                game.add.text(game.world.x + 95, game.world.y + 132 + 80 * i, (i + 1) + '. Jugador ' + game.scoreData[i].id + '.......................................... ' + game.scoreData[i].score + ' pts', style2);
            }
        },
        //esta función se llama cuando clickamos el botón de volver atrás en la esquina superior izquierda, llevándonos de nuevo al menú principal.
        actionONClickScore: function () {
        	scoreMusic.pause();
        
            game.state.start('menuState');
        }

    }
