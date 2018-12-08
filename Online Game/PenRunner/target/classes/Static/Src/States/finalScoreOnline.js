PenRunner.scoreOnlineState = function (game) { }


PenRunner.scoreOnlineState.prototype =
    {
        create: function () {
            this.sendPlayerUpdate(); //Recogemos la información de los jugadores para escribir correctamente los nombres y las puntuaciones
            var background = game.add.sprite(game.world.x, game.world.y - 25, 'backgroundScore'); //Añadimos un sprite al background
            background.scale.setTo(0.65, 1); //Escalamos la imagen del background
            var buttonReturn = game.add.button(game.world.x + 42, game.world.y + 40, 'return', null, this, 0, 0, 0); //Botón para volver al menú principal

            //escalamos el boton de volver atrás
            buttonReturn.width = 35;
            buttonReturn.height = 40;
            //Esta instrucción detecta cuando se ha pulsado el botón de vuelta atrás y ejecuta el bloque de código en la función actionOnClickScore()
            buttonReturn.onInputUp.add(this.actionONClickScore, this);


            //Llamamos a la función que recibe la información ordenada de los jugadores en función de su puntuación
            this.updatePlayers(function (data) {
                for (var i = 0; i < game.numPlayers; i++) {
                	var jugador = game.add.sprite(game.world.x + 34, game.world.y + (110 + 80 * i) , 'jugador');
                	jugador.scale.setTo(1.6, 0.8);
                	//Aquí imprimimos el texto que dice la puntuación y el jugador correspondiente, ya ordenado
                    game.add.text(game.world.x + 95, game.world.y + 132 + 80 * i, (i + 1) + '. Jugador ' + game.scoreData[i].id + '.......................................... ' + game.scoreData[i].score + ' pts', style2);
                }
            });

            //Texto de la puntuación final.
            var text = game.add.text(game.world.centerX - 222, game.world.centerY - 275, 'Puntuación Final', style5);
        },
        //Cuando llamamos a esta función devolvemos una lista con todos los jugadores de la partida, ordenados por la puntuación que han obtenido en la partida,
        //es decir, en función de cuando hayan llegado a la meta, se les asigna una puntuación, y, en función de eso, se les ordena.
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
                url: 'http://localhost:8080/player/' + id,
                processData: false,
                headers: {
                    "Content-Type": "application/json"
                },
            }).done(function (data) {
                console.log('Se ha borrado el jugador' + JSON.stringify(data));
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

        //esta función se llama cuando clickamos el botón de volver atrás en la esquina superior izquierda, llevándonos de nuevo al menú principal.
        actionONClickScore: function () {
            for (var i = 0; i < game.numPlayers; i++) {
            	//Borramos a los jugadores de la partida, para que al volver al menú principal, los jugadores empiecen de 0
                this.deletePlayer(i);
            }
            game.state.start('menuState');
        }

    }
