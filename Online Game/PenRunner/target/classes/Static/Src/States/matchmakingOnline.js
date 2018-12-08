PenRunner.matchmakingOnlineState = function (game) { }





PenRunner.matchmakingOnlineState.prototype =
    {

        create: function () {
        	
        	//Inicializamos las variables que vamos a utilizar en este estado
            votado = false; //Variable que nos dice si un jugador ya ha votado o no
            contador = 1200;
            numeroDeVotos1 = 0;
            numeroDeVotos2 = 0;
            numeroDeVotos3 = 0;
            this.joinKey = 0;
            this.joinKey2 = 0;
            var sceneTime = 0;
            empezado = false;
            numeroDeJugadores = 0;
            //Llamamos a estas funciones, para comprobar cuando se entra en este estado cuantos jugadores hay ya en la sala, y si la partida ha empezado
            this.getNumPlayers();
            this.isStarted();

            game.stage.backgroundColor = '#182d3b';
            var background = game.add.tileSprite(0, 0, 800, 600, 'background'); //Añadimos un sprite al background

            buttonMap = game.add.button(game.world.x + 40, 40, 'button', null, this, 1, 0, 2) //Establecemos las caracteristicas del primer boton
            buttonMap2 = game.add.button(game.world.x + 300, 40, 'button2', null, this, 10, 10, 0) //Establecemos las caracteristicas del segundo boton
            buttonMap3 = game.add.button(game.world.x + 560, 40, 'button3', null, this, 10, 10, 0) //Establecemos las caracteristicas del tercer boton

            //Establecemos el tamaño de los tres botones
            buttonMap.width = buttonMap2.width = buttonMap3.width = 200;
            buttonMap.height = buttonMap2.height = buttonMap3.height = 200;

            text = game.add.text(game.world.centerX - 249, game.world.centerY + 253, 'Tiempo restante para iniciar partida: 12', style3);  //ponemos la variable text en el recinto y la editamos 
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
            //  var jugador5 = game.add.sprite(game.world.x+40, game.world.y+470, 'jugadorMatch').alignTo(jugador4, Phaser.RIGHT_CENTER, -240);
            //  var jugador6 = game.add.sprite(game.world.x+40, game.world.y+470, 'jugadorMatch').alignTo(jugador5, Phaser.RIGHT_CENTER, -240);

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

            this.setTimer(15 * 1000);

            if (numeroDeJugadores < 4 && !empezado) { //Mientras haya menos de 4 jugadores, y la partida no haya empezado, podemos seguir creando jugadores
                this.createPlayer();
                this.createVotes();
            }


        },

        update: function () { //Función que se ejecuta una vez por frame
        	//Si el numero de jugadores ha llegado a más de cuatro e intenta entrar otro, vuelve a cargar el menú principal, porque ya se ha alcanzado el 
        	//número máximo de jugadores
            this.getNumPlayers();
            if (numeroDeJugadores > 4) {
                game.state.start('menuState');
            }
            //Este swtich sirve para que escriba en las cajas correspondientes los jugadores que existen en todo momento. 
            switch (numeroDeJugadores) { 

                case 2:
                    textPlayer2.destroy();
                    game.add.text(game.world.x + 475, game.world.y + 372, 'Jugador 2', style3);
                    break;

                case 3:
                    textPlayer3.destroy();
                    textPlayer2.destroy();
                    game.add.text(game.world.x + 475, game.world.y + 372, 'Jugador 2', style3);
                    game.add.text(game.world.x + 195, game.world.y + 472, 'Jugador 3', style3);
                    break;

                case 4:
                    textPlayer2.destroy();
                    textPlayer3.destroy();
                    textPlayer4.destroy();
                    game.add.text(game.world.x + 475, game.world.y + 372, 'Jugador 2', style3);
                    game.add.text(game.world.x + 195, game.world.y + 472, 'Jugador 3', style3);
                    game.add.text(game.world.x + 475, game.world.y + 472, 'Jugador 4', style3);
                    break;

            }
            //Con esta llamada actualizamos la votación de los mapas desde el servidor
            this.getRealVotes();



            //Llamamos a la funcion que actualiza la cuenta atrás de la sala pre-partida dentro del servidor, metemos la funcion como 
            //parámetro para que se actualice antes de que se continúe ejecutando el código-
            this.updateTimer(function (data) {
                contador = 15 - data / 1000; //como lo ejecutamos con el contador del sistema, lo dividimos entre 1000 para que concuerde con un numero entero
                

                text.setText('Tiempo restante para iniciar partida: ' + Math.round(contador));
            });
            
            //si el contador se acaba, pero solo hay un jugador, se vuelve a llamar al estado para que vuelva una oportunidad a los jugadores que no 
            //hayan entrado todavía
            if (contador <= 0 && numeroDeJugadores <= 1) {
                game.state.start('matchmakingOnlineState');

            }


            //Si el contador ya se ha acabado, pero los jugadores están comprendidos entre dos y cuatro personas, se prosigue a elegir el mapa
            //mas votado desde el servidor el forma de JSON para que se cargue en el siguiente estado. Después, se carga el estado del juego con
            //el mapa seleccionado
            if (contador <= 0 && numeroDeJugadores <= 4) {
                this.getTrack(function (data) {
                    game.chosenCircuit = JSON.parse(JSON.stringify(data));
                })
                if (numeroDeJugadores > 1 && game.chosenCircuit != null) {
                    this.isStarted(); //Se cambia el booleano para indicar que la partida ya ha empezado
                    game.state.start('preloadMatchOnlineState');
                }

            }

            votos1.setText(numeroDeVotos1);
            votos2.setText(numeroDeVotos2);
            votos3.setText(numeroDeVotos3);

        },
        //esta funcion llama al servidor mediante una petición get, y creamos un jugador nuevo, con todas sus caracteriticas ya descritas en 
        //GameController
        createPlayer: function () {
            $.ajax({
                method: "POST",
                url: 'http://localhost:8080/player',
                processData: false,
                headers: {
                    "Content-Type": "application/json"
                },
            }).done(function (data) {
                game.player = data
                textPlayer.destroy();
                game.add.text(game.world.x + 195, game.world.y + 372, 'Jugador 1', style3);

            })
        },
        //Devuelve el número de jugadores que hay hasta ahora en la sala pre-partida
        getNumPlayers: function () {
            $.ajax({
                url: 'http://localhost:8080/player/number',
            }).done(function (data) {
                game.numPlayers = JSON.parse(JSON.stringify(data));
                numeroDeJugadores = data;
            })
        },
        //Hacemos una llamada al servidor que borra un jugador
        deletePlayer: function () {
            $.ajax({
                method: "DELETE",
                url: 'http://localhost:8080/player',
                processData: false,
                headers: {
                    "Content-Type": "application/json"
                },
            }).done(function (data) {
            })
        },
        //esta función llama al servidor para crear un voto único para cada jugador, de tal modo que cuando un jugador vote, el voto se anula y no puede
        //volver a votar
        createVotes: function () {
            $.ajax({
                method: "POST",
                url: 'http://localhost:8080/voto',
                processData: false,
                headers: {
                    "Content-Type": "application/json"
                },
            }).done(function (data) {
            })
        },
        //Crea el objeto de tipo timer. En resumen, crea el cronómetro que hace la cuenta atrás para iniciar la partida dentro del matchmaking
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
        //Actualiza el cronómetro que lleva la cuenta atrás para que empiece la partida
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
        //Esta función llama al servidor para decir si la función ya se ha iniciado, y guarda la variable booleana en el servidor, de tal modo que
        //si la partida ha empezado, devuelve un true, y no puede iniciarse la partida
        isStarted: function () {
            $.ajax({
                method: "GET",
                url: 'http://localhost:8080/isStarted',
                processData: false,
                headers: {
                    "Content-Type": "application/json"
                },
            }).done(function (data) {
                empezado = data;
            })
        },


        up: function () //Función que se llama cuando clickamos sobre el mapa que esta situado más a la izquierda
        {

            if (numeroDeVotos1 < 9 && !votado) {

                this.getVotes(); //Llamamos a la función para actualizar el número de votos en el servidor
                votado = true;
            }
            votos1.setText(numeroDeVotos1);

        },
        up2: function ()//Función que se llama cuando clickamos sobre el mapa que esta situado en el centro
        {

            if (numeroDeVotos2 < 9 && !votado) {
                this.getVotes2();
                votado = true;
            }
            votos2.setText(numeroDeVotos2);

        },

        up3: function ()//Función que se llama cuando clickamos sobre el mapa que esta situado más a la derecha
        {
            votos3.setText(numeroDeVotos3);

            if (numeroDeVotos3 < 9 && !votado) {
                this.getVotes3();
                votado = true;
            }

        },
        //Esta función llama al servidor para indicar la actualización de los votos, pero no de un voto en concreto, como las funciones que tenemos abajo
        //sino que devuelve el array con todos los votos de los tres mapas
        updateNumberOfVotes: function (mapa) {
            $.ajax({
                method: "PUT",
                url: 'http://localhost:8080/voto',
                processData: false,
                headers: {
                    "Content-Type": "application/json"
                },
            }).done(function (data) {
            })

        },
        //Actualiza el numero de votos que se ha hecho en el mapa 1
        getVotes: function () {
            $.ajax({
                method: "GET",
                url: 'http://localhost:8080/voto/voto1',
                processData: false,
                headers: {
                    "Content-Type": "application/json"
                },
            }).done(function (data) {
                console.log(data);
                // numeroDeVotos1 = data;
            })
        },
        //Actualiza el numero de votos que se ha hecho en el mapa 2
        getVotes2: function () {
            $.ajax({
                method: "GET",
                url: 'http://localhost:8080/voto/voto2',
                processData: false,
                headers: {
                    "Content-Type": "application/json"
                },
            }).done(function (data) {
            })
        },
        //Actualiza el numero de votos que se ha hecho en el mapa 3
        getVotes3: function () {
            $.ajax({
                method: "GET",
                url: 'http://localhost:8080/voto/voto3',
                processData: false,
                headers: {
                    "Content-Type": "application/json"
                },
            }).done(function (data) {
            })
        },
        //esta función nos devuelve desde el servidor el número de votos finales que han tenido los mapas, y en consecuencia, carga el mapa correspondiente.
        getRealVotes: function () {
            $.ajax({
                method: "GET",
                url: 'http://localhost:8080/voto',
                processData: false,
                headers: {
                    "Content-Type": "application/json"
                },
            }).done(function (data) {
                numeroDeVotos1 = data[0];
                numeroDeVotos2 = data[1];
                numeroDeVotos3 = data[2];

            })
        },
        //Esta funcion hace una llamada al servidor, donde cogemos el JSON del mapa más votado, para devolverlo y cargarlo en el siguiente estado
        //que se va a cargar.
        getTrack: function (callback) {
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


