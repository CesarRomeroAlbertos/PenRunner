PenRunner.scoreOnlineState = function (game) { }


PenRunner.scoreOnlineState.prototype =
    {
        create: function () {
            this.sendPlayerUpdate();
            var background = game.add.sprite(game.world.x, game.world.y - 25, 'backgroundScore'); //Añadimos un sprite al background
            background.scale.setTo(0.65, 1); //Escalamos la imagen del background
            var buttonReturn = game.add.button(game.world.x + 42, game.world.y + 40, 'return', null, this, 0, 0, 0); //Botón para volver al menú principal

            //escalamos el boton de volver atrás
            buttonReturn.width = 35;
            buttonReturn.height = 40;
            //Esta instrucción detecta cuando se ha pulsado el botón de vuelta atrás y ejecuta el bloque de código en la función actionOnClickScore()
            buttonReturn.onInputUp.add(this.actionONClickScore, this);

            //Creamos los sprites para los fondos de puntuación de los jugadores
            /*var jugador = game.add.sprite(game.world.x + 65, game.world.y + 140, 'jugador');
            var jugador2 = game.add.sprite(game.world.x + 65, game.world.y + 210, 'jugador');
            var jugador3 = game.add.sprite(game.world.x + 65, game.world.y + 290, 'jugador');
            var jugador4 = game.add.sprite(game.world.x + 65, game.world.y + 370, 'jugador');
            var jugador5 = game.add.sprite(game.world.x + 65, game.world.y + 450, 'jugador');
            var jugador6 = game.add.sprite(game.world.x + 65, game.world.y + 530, 'jugador');*/


            this.updatePlayers(function (data) {
                for (var i = 0; i < game.numPlayers; i++) {
                	var jugador = game.add.sprite(game.world.x + 34, game.world.y + (110 + 80 * i) , 'jugador');
                	jugador.scale.setTo(1.6, 0.8);
                    game.add.text(game.world.x + 95, game.world.y + 132 + 80 * i, (i + 1) + '. Jugador ' + game.scoreData[i].id + '.......................................... ' + game.scoreData[i].score + ' pts', style2);
                }
            });



            //Se escala el fondo de puntuacion de los jugadores, a priori es un sprite muy básico, se cambiará mas adelante
            /*jugador.scale.setTo(1.6, 0.8);
            jugador2.scale.setTo(1.6, 0.8);
            jugador3.scale.setTo(1.6, 0.8);
            jugador4.scale.setTo(1.6, 0.8);
            jugador5.scale.setTo(1.6, 0.8);
            jugador6.scale.setTo(1.6, 0.8);*/

            //Texto de la puntuación final.
            var text = game.add.text(game.world.centerX - 222, game.world.centerY - 275, 'Puntuación Final', style5);
        },

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
                this.deletePlayer(i);
            }
            game.state.start('menuState');
        }

    }
