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
<<<<<<< HEAD
       //     var music = game.add.audio('scoreMusic');
        //    music.play();
=======
>>>>>>> 883a427ec9115f8b588d91fbb8998fd4d656f6a7

            //Texto de la puntuación final.
            var text = game.add.text(game.world.centerX - 222, game.world.centerY - 275, 'Puntuación Final', style5);
        },
        //Cuando llamamos a esta función devolvemos una lista con todos los jugadores de la partida, ordenados por la puntuación que han obtenido en la partida,
        //es decir, en función de cuando hayan llegado a la meta, se les asigna una puntuación, y, en función de eso, se les ordena e imprime en la pantalla
        updatePlayers: function () {
            for (var i = 0; i < game.numPlayers; i++) {
                var jugador = game.add.sprite(game.world.x + 34, game.world.y + (110 + 80 * i) , 'jugador');
                jugador.scale.setTo(1.6, 0.8);
                //Aquí imprimimos el texto que dice la puntuación y el jugador correspondiente, ya ordenado
                game.add.text(game.world.x + 95, game.world.y + 132 + 80 * i, (i + 1) + '. Jugador ' + game.scoreData[i].id + '.......................................... ' + game.scoreData[i].score + ' pts', style2);
            }
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
                console.log('Se ha borrado el jugador' + JSON.stringify(data));
            })
        },
        //esta función se llama cuando clickamos el botón de volver atrás en la esquina superior izquierda, llevándonos de nuevo al menú principal.
        actionONClickScore: function () {
            game.state.start('menuState');
        }

    }
