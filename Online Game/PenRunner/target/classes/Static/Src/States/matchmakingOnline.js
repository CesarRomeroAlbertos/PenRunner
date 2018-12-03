PenRunner.matchmakingOnlineState = function (game) { }





PenRunner.matchmakingOnlineState.prototype =
    {

        create: function () {
            votado = false;
            //	this.deletePlayer();
            contador = 15;
            numeroDeVotos1 = 0;
            numeroDeVotos2 = 0;
            numeroDeVotos3 = 0;
            this.joinKey = 0;
            this.joinKey2 = 0;
            var sceneTime = 0;

            game.stage.backgroundColor = '#182d3b';

            var background = game.add.tileSprite(0, 0, 800, 600, 'background'); //Añadimos un sprite al background

            this.createPlayer();
            this.createVotes();

            buttonMap = game.add.button(game.world.x + 40, 40, 'button', null, this, 1, 0, 2) //Establecemos las caracteristicas del primer boton
            buttonMap2 = game.add.button(game.world.x + 300, 40, 'button2', null, this, 10, 10, 0) //Establecemos las caracteristicas del segundo boton
            buttonMap3 = game.add.button(game.world.x + 560, 40, 'button3', null, this, 10, 10, 0) //Establecemos las caracteristicas del tercer boton

            //Establecemos el tamaño de los tres botones
            buttonMap.width = buttonMap2.width = buttonMap3.width = 200;
            buttonMap.height = buttonMap2.height = buttonMap3.height = 200;

            text = game.add.text(game.world.centerX - 270, game.world.centerY + 250, 'Tiempo restante para iniciar partida: 12', style3);  //ponemos la variable text en el recinto y la editamos 
            text2 = 'Vacío';

            votos1 = game.add.text(game.world.x + 120, 250, numeroDeVotos1, style1);
            votos2 = game.add.text(game.world.x + 380, 250, numeroDeVotos2, style1);
            votos3 = game.add.text(game.world.x + 640, 250, numeroDeVotos3, style1);

            //Boton izquierda
            buttonMap.onInputUp.add(this.up, this); //Cuando clickamos el boton, ejecuta la función up()

            //Boton centro
            buttonMap2.onInputUp.add(this.up2, this); //Cuando clickamos el boton, ejecuta la función up()

            //Boton derecha
            buttonMap3.onInputUp.add(this.up3, this); //Cuando clickamos el boton, ejecuta la función up()

            //var timerMatchmaking = game.time.events.loop(Phaser.Timer.SECOND, showSeconds, this); //Hacemos un bucle que varie en función de los segundos, es decir, cada segundo, llama a la funcion showSeconds().
            //Estalbecemos las posiciones de los sprites de cada uno de los huecos donde se pueden poner los nombres de los jugadores.
            var jugador = game.add.sprite(game.world.x + 40, game.world.y + 370, 'jugadorMatch');
            var jugador2 = game.add.sprite(game.world.x + 40, game.world.y + 370, 'jugadorMatch').alignTo(jugador, Phaser.RIGHT_CENTER, -240);
            // var jugador3 = game.add.sprite(game.world.x+40, game.world.y+370, 'jugadorMatch').alignTo(jugador2, Phaser.RIGHT_CENTER, -240);
            //  var jugador4 = game.add.sprite(game.world.x+40, game.world.y+470, 'jugadorMatch');
            //  var jugador5 = game.add.sprite(game.world.x+40, game.world.y+470, 'jugadorMatch').alignTo(jugador4, Phaser.RIGHT_CENTER, -240);
            //  var jugador6 = game.add.sprite(game.world.x+40, game.world.y+470, 'jugadorMatch').alignTo(jugador5, Phaser.RIGHT_CENTER, -240);

            //escalamos los botones donde iran el nombres de los jugadores.
            jugador.scale.setTo(0.4, 0.5);
            jugador2.scale.setTo(0.4, 0.5);
            //  jugador3.scale.setTo(0.4, 0.5);
            //  jugador4.scale.setTo(0.4, 0.5);
            // jugador5.scale.setTo(0.4, 0.5);
            // jugador6.scale.setTo(0.4, 0.5);

            //Aquí guardamos los nombres de los jugadores, de momento, están establecidos por defecto a jugador 1 y jugador 2. Pero se estudiará el hecho de incluir nombres personalizados
            textPlayer = game.add.text(game.world.x + 100, game.world.y + 382, text2, style2);
            var textPlayer2 = game.add.text(game.world.x + 360, game.world.y + 382, text2, style2);

            //Mostramos el resto de textos donde pone "Vacío"
            // game.add.text(game.world.x+620, game.world.y+382, text2, style2);
            //  game.add.text(game.world.x+100, game.world.y+482, text2, style2);
            //  game.add.text(game.world.x+360, game.world.y+482, text2, style2);
            // game.add.text(game.world.x+620, game.world.y+482, text2, style2);

            //Hemos declarado dos variables con las que hacemos que los jugadores se unan a la partida
            joinKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
            joinKey2 = game.input.keyboard.addKey(Phaser.Keyboard.W);

            this.setTimer(15 * 1000);

        },

        update: function () { //Función que se ejecuta una vez por frame
            //Si el contador se queda a 0, lo ponemos a 5 para la siguiente vez que se cargue la escena
            this.getNumPlayers(function (numPlayers) {
                if (numPlayers.length === 2) {
                    //console.log('##### COMIENZA EL JUEGO #####');
                }

            });
            this.updateTimer(function (data) {
                console.log("tiempo recibido: " + data + " /n tiempo restante: " + 15 - data / 1000);
                contador = 15 - data / 1000;
                text.setText('Tiempo restante para iniciar partida: ' + Math.round(contador));
                // console.log(contador);
                // console.log('Se ha actualizado el timer: ' + contador);
            });


            if (contador = 0) {
                //this.getNumPlayers();
                this.getTrack(function(data){
                    game.chosenCircuit = JSON.parse(JSON.stringify(data));
                })
                game.state.start('preloadMatchOnlineState');
            }
            //Si se pulsa la tecla seleccionada en el teclado, se une uno de los dos jugadores
            if (joinKey.isDown) {
                textPlayer2.destroy();
                game.add.text(game.world.x + 340, game.world.y + 382, 'Jugador 2', style2);
            }


        },
        createPlayer: function () {
            $.ajax({
                method: "POST",
                url: 'http://localhost:8080/player',
                processData: false,
                headers: {
                    "Content-Type": "application/json"
                },
            }).done(function (data) {
                //console.log("Se ha creado el jugador: " + JSON.stringify(data));
                game.player = data
                textPlayer.destroy();
                game.add.text(game.world.x + 80, game.world.y + 382, 'Jugador 1', style2);
            })
        },

        getNumPlayers: function () {
            $.ajax({
                url: 'http://localhost:8080/player/number',
            }).done(function (data) {
                //console.log("Hay " + JSON.stringify(data) + " jugadores")
                game.numPlayers = JSON.parse(JSON.stringify(data));
            })
        },

        deletePlayer: function () {
            $.ajax({
                method: "DELETE",
                url: 'http://localhost:8080/player',
                processData: false,
                headers: {
                    "Content-Type": "application/json"
                },
            }).done(function (data) {
                //console.log('Se ha borrado el jugador' + JSON.stringify(data));
            })
        },
        createVotes: function () {
            $.ajax({
                method: "POST",
                url: 'http://localhost:8080/voto',
                processData: false,
                headers: {
                    "Content-Type": "application/json"
                },
            }).done(function (data) {
                //  numeroDeVotos1 += data;
                //console.log('Se ha creado el voto para el jugador: ' + JSON.stringify(data));
                //console.log(numeroDeVotos1);

            })
        },

        setTimer: function (time) {
            $.ajax({
                method: "POST",
                url: 'http://localhost:8080/timer/' + time,
                processData: false,
                headers: {
                    "Content-Type": "application/json"
                },
            }).done(function (data) {
            })
        },

        updateTimer: function (callback) {

            $.ajax({
                method: "GET",
                url: 'http://localhost:8080/timer',
                processData: false,
                headers: {
                    "Content-Type": "application/json"
                },
            }).done(function (data) {
                callback(JSON.parse(JSON.stringify(data)));
            })
        },


        up: function () //Función que se llama cuando clickamos sobre el mapa que esta situado más a la izquierda
        {

            if (numeroDeVotos1 < 9 && !votado) {

                this.getVotes(); //Llamamos a la función para actualizar el número de votos en el servidor
               // votado = true;
            }
            console.log(numeroDeVotos1)
            votos1.setText(numeroDeVotos1);

        },
        up2: function ()//Función que se llama cuando clickamos sobre el mapa que esta situado en el centro
        {

            if (numeroDeVotos2 < 9 && !votado)
                this.updateNumberOfVotes(2);
            // numeroDeVotos2++;

        },

        up3: function ()//Función que se llama cuando clickamos sobre el mapa que esta situado más a la derecha
        {
            votos3.setText(numeroDeVotos3);

            if (numeroDeVotos3 < 9 && !votado)
                this.updateNumberOfVotes(3);


            //numeroDeVotos3++;
        },

        updateNumberOfVotes: function (mapa) {
            $.ajax({
                method: "PUT",
                url: 'http://localhost:8080/voto',
                processData: false,
                headers: {
                    "Content-Type": "application/json"
                },
            }).done(function (data) {
                /*
                numeroDeVotos1 += data;
                console.log(numeroDeVotos1);
                console.log('Se ha actualizado la votación del primer mapa: ' + numeroDeVotos1);
                votos1.setText(numeroDeVotos1); //Imprimimos el resultado por pantalla.
                votado = true;*/
            })

        },
        
        getVotes: function(){
        	 $.ajax({
                 method: "GET",
                 url: 'http://localhost:8080/voto',
                 processData: false,
                 headers: {
                     "Content-Type": "application/json"
                 },
             }).done(function (data) {
                 console.log(data);
                 numeroDeVotos1 = data;
             })
        },

        getTrack: function(callback)
	{
		{
			$.ajax({
				method: "GET",
				url: 'http://localhost:8080/chosenMap',
				processData: false,
				headers: {
					"Content-Type": "application/json"
				}
			}).done(function (data) {
				callback(JSON.parse(JSON.stringify(data)));
			})
		}
	}


    }


