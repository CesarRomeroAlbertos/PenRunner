PenRunner.matchmakingWSState = function (game) {
}




PenRunner.matchmakingWSState.prototype =
    {

        create: function () {

            var createPlayermsg = {
                type: 'create_player'
            };
            ws.send(JSON.stringify(createPlayermsg));

            //Inicializamos las variables que vamos a utilizar en este estado
            votado = false; //Variable que nos dice si un jugador ya ha votado o no

            contador = 0;
            numeroDeVotos1 = 0;
            numeroDeVotos2 = 0;
            numeroDeVotos3 = 0;
            var sceneTime = 0;
            empezado = false;
            //Llamamos a estas funciones, para comprobar cuando se entra en este estado cuantos jugadores hay ya en la sala, y si la partida ha empezado
            //this.getNumPlayers();
            //this.isStarted();
            //Llamamos a crear jugador a traves de webSockets
            // var message = { type: "create_player" };
            // ws.send(JSON.Stringify(message))

            game.stage.backgroundColor = '#182d3b';
            var background = game.add.tileSprite(0, 0, 800, 600, 'background'); //Añadimos un sprite al background

            buttonMap = game.add.button(game.world.x + 40, 40, 'button', null, this, 1, 0, 2) //Establecemos las caracteristicas del primer boton
            buttonMap2 = game.add.button(game.world.x + 300, 40, 'button2', null, this, 10, 10, 0) //Establecemos las caracteristicas del segundo boton
            buttonMap3 = game.add.button(game.world.x + 560, 40, 'button3', null, this, 10, 10, 0) //Establecemos las caracteristicas del tercer boton

            //Establecemos el tamaño de los tres botones
            buttonMap.width = buttonMap2.width = buttonMap3.width = 200;
            buttonMap.height = buttonMap2.height = buttonMap3.height = 200;

            text = game.add.text(game.world.centerX - 249, game.world.centerY + 253, 'Tiempo restante para iniciar partida: 15', style3);  //ponemos la variable text en el recinto y la editamos 
            text2 = 'Vacío';

            votos1 = game.add.text(game.world.x + 124, 250, numeroDeVotos1, style4);
            votos2 = game.add.text(game.world.x + 384, 250, numeroDeVotos2, style4);
            votos3 = game.add.text(game.world.x + 644, 250, numeroDeVotos3, style4);

            //Boton izquierda
            buttonMap.onInputUp.add(this.up, this); //Cuando clickamos el boton, ejecuta la función up()

            //Boton centro
            buttonMap2.onInputUp.add(this.up2, this); //Cuando clickamos el boton, ejecuta la función up()

            //Boton derecha
            buttonMap3.onInputUp.add(this.up3, this); //Cuando clickamos el boton, ejecuta la función up()

            //var timerMatchmaking = game.time.events.loop(Phaser.Timer.SECOND, showSeconds, this); //Hacemos un bucle que varie en función de los segundos, es decir, cada segundo, llama a la funcion showSeconds().
            //Estalbecemos las posiciones de los sprites de cada uno de los huecos donde se pueden poner los nombres de los jugadores.
            var jugador = game.add.sprite(game.world.x + 160, game.world.y + 360, 'jugadorMatch');
            var jugador2 = game.add.sprite(game.world.x + 440, game.world.y + 360, 'jugadorMatch');
            var jugador3 = game.add.sprite(game.world.x + 160, game.world.y + 460, 'jugadorMatch');
            var jugador4 = game.add.sprite(game.world.x + 440, game.world.y + 460, 'jugadorMatch');

            //escalamos los botones donde iran el nombres de los jugadores.
            jugador.scale.setTo(0.4, 0.5);
            jugador2.scale.setTo(0.4, 0.5);
            jugador3.scale.setTo(0.4, 0.5);
            jugador4.scale.setTo(0.4, 0.5);

            //Mostramos todos los jugadores como "Vacío"
            textPlayer = game.add.text(game.world.x + 220, game.world.y + 372, text2, style3);
            textPlayer2 = game.add.text(game.world.x + 500, game.world.y + 372, text2, style3);
            textPlayer3 = game.add.text(game.world.x + 220, game.world.y + 472, text2, style3);
            textPlayer4 = game.add.text(game.world.x + 500, game.world.y + 472, text2, style3);


            //Hemos declarado dos variables con las que hacemos que los jugadores se unan a la partida
            joinKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
            joinKey2 = game.input.keyboard.addKey(Phaser.Keyboard.W);

            // this.createPlayer();
            var message = { type: "create_player" };

            ws.onopen = () => ws.send(JSON.stringify(message));

        },

        update: function () { //Función que se ejecuta una vez por frame
            //Si el numero de jugadores ha llegado a más de cuatro e intenta entrar otro, vuelve a cargar el menú principal, porque ya se ha alcanzado el 
            //número máximo de jugadores
            // this.getNumPlayers();

            if (game.numPlayers > 4 && game.player.id > 4) {
                game.state.start('menuState');
            }
            //Este swtich sirve para que escriba en las cajas correspondientes los jugadores que existen en todo momento. 
            //console.log(numeroDeJugadores);
            switch (game.numPlayers) {

                case '1':
                    textPlayer.destroy();
                    textPlayer = game.add.text(game.world.x + 195, game.world.y + 372, 'Jugador 1', style3);
                    break;

                case '2':
                    textPlayer2.destroy();
                    textPlayer.destroy();
                    textPlayer = game.add.text(game.world.x + 195, game.world.y + 372, 'Jugador 1', style3);
                    textPlayer2 = game.add.text(game.world.x + 475, game.world.y + 372, 'Jugador 2', style3);
                    break;

                case '3':
                    textPlayer.destroy();
                    textPlayer2.destroy();
                    textPlayer3.destroy();
                    textPlayer = game.add.text(game.world.x + 195, game.world.y + 372, 'Jugador 1', style3);
                    textPlayer2 = game.add.text(game.world.x + 475, game.world.y + 372, 'Jugador 2', style3);
                    textPlayer3 = game.add.text(game.world.x + 195, game.world.y + 472, 'Jugador 3', style3);
                    break;

                case '4':
                    textPlayer.destroy();
                    textPlayer2.destroy();
                    textPlayer3.destroy();
                    textPlayer4.destroy();
                    textPlayer = game.add.text(game.world.x + 195, game.world.y + 372, 'Jugador 1', style3);
                    textPlayer2 = game.add.text(game.world.x + 475, game.world.y + 372, 'Jugador 2', style3);
                    textPlayer3 = game.add.text(game.world.x + 195, game.world.y + 472, 'Jugador 3', style3);
                    textPlayer4 = game.add.text(game.world.x + 475, game.world.y + 472, 'Jugador 4', style3);
                    break;

            }
            votos1.setText(numeroDeVotos1);
            votos2.setText(numeroDeVotos2);
            votos3.setText(numeroDeVotos3);

        },
        //Actualiza el cronómetro que lleva la cuenta atrás para que empiece la partida
        updateTimer: function (time) {
            text.setText('Tiempo restante para iniciar partida: ' + time);
        },

        up: function () //Función que se llama cuando clickamos sobre el mapa que esta situado más a la izquierda
        {
            if (!votado) {
                var voteMessage = {
                    type: "vote",
                    data: 0
                };
                ws.send(JSON.stringify(voteMessage));
                votado = true;
            }
        },
        up2: function ()//Función que se llama cuando clickamos sobre el mapa que esta situado en el centro
        {
            if (!votado) {
                var voteMessage = {
                    type: "vote",
                    data: 1
                };
                ws.send(JSON.stringify(voteMessage));
                votado = true;
            }
        },

        up3: function ()//Función que se llama cuando clickamos sobre el mapa que esta situado más a la derecha
        {
            if (!votado) {
                var voteMessage = {
                    type: "vote",
                    data: 2
                };
                ws.send(JSON.stringify(voteMessage));
                votado = true;
            }
        },
        //Esta función llama al servidor para indicar la actualización de los votos, pero no de un voto en concreto, como las funciones que tenemos abajo
        //sino que devuelve el array con todos los votos de los tres mapas
        updateNumberOfVotes: function (votes) {
            numeroDeVotos1 = votes[0];
            numeroDeVotos1 = votes[1];
            numeroDeVotos1 = votes[2];
        },
        //Esta funcion hace una llamada al servidor, donde cogemos el JSON del mapa más votado, para devolverlo y cargarlo en el siguiente estado
        //que se va a cargar.
        endMatchmaking: function (number) {
            game.chosenCircuit = number;
            game.state.start('preloadMatchOnlineState');
        }


    }


