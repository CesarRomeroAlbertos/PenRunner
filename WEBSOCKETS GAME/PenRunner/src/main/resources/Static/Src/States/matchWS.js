PenRunner.matchOnlineWSState = function (game) { }

PenRunner.matchOnlineState.prototype =
	{
		//Aquí creamos todas las cosas necesarias para usar en la clase match
		create: function () {
			game.Goal = false;
			this.getNumPlayers(function (data) {
				game.numPlayers = data;
			});
			numeroMeta = 0; //Indica el número de jugadores que han llegado a la meta hasta ese momento
			playerId = game.player.id; //en esta variable guardamos el id del jugador en cuestión
			//nos aseguramos de que el fondo sea blanco	
			game.stage.backgroundColor = "#FFFFFF";

			//cogemos los jsons necesarios de la cache
			var trackJson = game.cache.getJSON('track');

			//metemos los sprites con sus colliders cuando son necesarios, todo leyendo del json del circuito,
			//y con las variables del mismo colocamos todo y construimos el circuito además de activar sus físicas
			walls = game.add.sprite(trackJson.wallsPositionX, trackJson.wallsPositionY, 'walls');
			start = game.add.sprite(trackJson.startPositionX, trackJson.startPositionY, 'start');
			goal = game.add.sprite(trackJson.goalPositionX, trackJson.goalPositionY, 'goal');
			
			//Con este trozo de código, decimos donde está la línea de meta y la línea de salida del mapa caegado desde el JSON (4 líneas siguientes)
			start.angle = trackJson.startRotation;
			start.scale.setTo(trackJson.startScaleX, 1);
			goal.angle = trackJson.goalRotation;
			goal.scale.setTo(trackJson.goalScaleX, 1);
			
			//Aquí cargamos las físicas necesarias para hacer las colisione con el mapa y con la línea de meta
			game.physics.p2.enable(goal, true);
			for (var i = 0; i < goal.body.data.shapes.length; i++)
				goal.body.data.shapes[i].sensor = true;
			//Propiedades de la línea de meta.
			goal.body.static = true;
			goal.body.x += goal.width / 2;
			goal.body.y += goal.height / 2;
			goal.body.debug = false;
			
			//Colisiones de las paredes
			game.physics.p2.enable(walls, true);
			walls.body.x += walls.width / 2;
			walls.body.y += walls.height / 2;

			walls.body.clearShapes(); //Hacemos las colisiones mas limpias
			walls.body.loadPolygon('wallsCollision', 'wallsTrack'); //Cargamos los poligonos de las paredes del mapa desde el JSON
			walls.body.static = true; //Hacemos que las paredes del mapa seas estáticas
			walls.body.debug = false;
			for (var i = 0; i < walls.body.data.shapes.length; i++) {
				walls.body.data.shapes[i].sensor = true;
			}
			//A partir de estas líneas de codigo definimos el jugador, sus características, como añadir el sprite, ajustar la escala del propio sprite
			//a parte de ajustar el ángulo que va a tener, que siempre son 45. 
			player = game.add.sprite(game.math.linear(trackJson.playerPositionXzero, trackJson.playerPositionXone, game.player.id / (game.numPlayers + 2)),
				game.math.linear(trackJson.playerPositionYzero, trackJson.playerPositionYone, game.player.id / (game.numPlayers + 2)),
				'player' + (game.player.id - 1));
			player.anchor.setTo(0, 0);
			player.scale.setTo(0.15, 0.15);
			player.angle += trackJson.playerAngle;
			//Ajustamos las coordenadas x e y al jugador y las establecemos con las que están guardadas en el servidor
			game.player.x = player.x;
			game.player.y = player.y;

			game.player.angle = player.angle;

			this.sendPlayerUpdate(); //Una vez hecho todo esto, llamamos a la función del server que actualiza al jugador. 



			//Aquí comprobamos si el número de jugadores que hay actualmente en la partida es mayor que uno, ya que si solo hay un jugador, no puede iniciar
			//la partida, y por lo tanto, hay que esperar a que haya, como mínimo, dos jugadores.
			if (game.numPlayers > 1) {

				game.altPlayers = game.add.group(); //Aquí agrupamos los jugadores en un array para poder gestionarlos más fácilmente

				var altCount = 0;
				//Mediante el código que tenemos en este for recorremos todo el array que hemos declarado anteriormente y creamos las caracteristicas para
				//todos los jugadores que hay en la partida concreta.
				for (var i = 0; i < game.numPlayers; i++) {
					if (i != (game.player.id - 1)) { //Este if impide que el for se salga de los límites del array
						game.altPlayers.create(game.math.linear(trackJson.playerPositionXzero, trackJson.playerPositionXone, (i + 1) / (game.numPlayers + 2)),
							game.math.linear(trackJson.playerPositionYzero, trackJson.playerPositionYone, (i + 1) / (game.numPlayers + 2)),
							'player' + i);
						game.altPlayers.children[altCount].anchor.setTo(0, 0); //ancho del sprite del jugador
						game.altPlayers.children[altCount].scale.setTo(0.15, 0.15);
						game.altPlayers.children[altCount].angle += trackJson.playerAngle; //Ángulo de apertura para jugar de cada jugador en concreto.
						altCount++;
					}
				}
			}


			//flecha y ángulo del primer jugador
			AngleLineLeft = game.add.sprite(player.x, player.y, 'angleLine');
			AngleLineRight = game.add.sprite(player.x, player.y, 'angleLine');
			DirectionArrow = game.add.sprite(player.x, player.y, 'angleLine' + (game.player.id - 1));
			//Aquí establecemos las características de los ángulos de dirección, tanto el de giro de la flecha como el del giro del angulo de dirección
			AngleLineLeft.anchor.setTo(0, 0.5);
			AngleLineLeft.angle = trackJson.directionAngle - 30;
			AngleLineRight.anchor.setTo(0, 0.5);
			AngleLineRight.angle = trackJson.directionAngle + 30;
			DirectionArrow.anchor.setTo(0, 0.5);
			DirectionArrow.angle = trackJson.directionAngle;
			//Por último, establecemos la escala para que se vea acorde con el propio sprite de jugador
			AngleLineLeft.scale.setTo(0.5, 0.5);
			AngleLineRight.scale.setTo(0.5, 0.5);
			DirectionArrow.scale.setTo(0.4, 0.3);


			//controles
			//estas variables definen los controles del jugador, en concreto, girar a izquierda o derecha, y para hacer el movimiento hacia delante
			leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
			rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
			forwardKey = game.input.keyboard.addKey(Phaser.Keyboard.W);


			forwardKey.onDown.add(this.changeState, this); //Cuando se pulsa la tecla hacia arriba, cambia el estado del jugador de quieto a moviendose


			//inicializamos variables de la escena

			playerState = 2;

			playerArrowDirection = true;

			timeCounter = 0;

			goalOrder = new Array();
			
			//Llamamos a la función para que actualice el movimiento de la tecla pulsada en el servidor
			this.setArrow();


			//Gestionamos todo acerca del semáforo, como las características del sprite, o donde irá colocado.
			semaforo = game.add.sprite(game.world.centerX, game.world.centerY, 'semaforo');
			semaforo.scale.setTo(1 / 3, 1 / 3);
			semaforo.x -= semaforo.width / 2;
			semaforo.y -= semaforo.height / 2;

			semaforoAnimation = semaforo.animations.add('semaforoAnim'); //Añadimos la animación para que cambie entre los estados del semáforo

			this.setTimer(semaforoAnimation.frameTotal * 1000); //Llamamos a la función que actualiza el timer del semaforo para que cambie de estado
			hasStarted = false;

			this.updatePlayers(function (data) { //esta funcion actualiza la posición de los jugadores en el server
				//CÓDIGO ACTUALIZAR ESTADO JUGADORES
				game.playersData = JSON.parse(JSON.stringify(data));
			});

		},

		//usamos update para los distintos controles de la partida, todo lo que ocurre aquí se actualiza una vez por frame
		update: function () {
			if (!hasStarted) { //Entra en el if si la partida no ha empezado
				this.updateTimer(function (data) { //Volvemos a llamar a que actualice el timer para cambiar los estados del semaforo

					if ((data / 1000) < semaforoAnimation.frameTotal) {
						semaforoAnimation.frame = Math.floor(data / 1000);
					}
					else {
						playerState = 0;
						player2State = 0;
						semaforo.destroy();
						hasStarted = true;
					}
				});
			}

			//tecla izquierda jugador 1
			if (leftKey.isDown && playerState == 0) {
				AngleLineLeft.angle -= 5;
				AngleLineRight.angle -= 5;
				player.angle -= 5;
			}
			//tecla derecha jugador 1
			else if (rightKey.isDown && playerState == 0) {
				AngleLineLeft.angle += 5;
				AngleLineRight.angle += 5;
				player.angle += 5;
			}

			//aquí llamamos a los métodos que giran la dirección de los jugadores o cambian la distancia que se mueven en función de su estado
			if (playerState == 0) {
				this.moveArrow(); //Llamada al servidor para cambiar la dirección del jugador
			}
			else if (playerState == 1) {
				this.powerArrow(); //Llamada al servidor para decidir cuanta distancia se mueve la flecha
			}
			//Cuando el estado es 3, quiere decir que el jugador se está moviendo, entonces tenemos que actulizar la posicion del sprite en la pantalla, para la cual 
			//sirven las siguientes líneas de código
			else if (playerState == 3) { 
				timeCounter += game.time.elapsedMS / 1000;
				player.x = game.math.linear(playerStartMovePositionX, playerFinalMovePositionX,
					Math.min(timeCounter / 0.3, 1));
				player.y = game.math.linear(playerStartMovePositionY, playerFinalMovePositionY,
					Math.min(timeCounter / 0.3, 1));
				//Para entrar en este if, el jugador acaba de terminar el movimiento, y se pinta la linea de trazo por donde ha pasado el jugador
				if (timeCounter >= 0.3) {
					playerState = 0;
					var line = game.add.sprite(playerStartMovePositionX, playerStartMovePositionY, 'angleLine' + (game.player.id - 1));
					line.angle = DirectionArrow.angle;
					var lineScale = Phaser.Math.linear(0, 1, Phaser.Math.distance(playerStartMovePositionX, playerStartMovePositionY,
						playerFinalMovePositionX, playerFinalMovePositionY) / (2 * AngleLineLeft.width));
					line.scale.setTo(lineScale, 0.3);
					AngleLineLeft.x = player.x;
					AngleLineLeft.y = player.y;
					AngleLineRight.x = player.x;
					AngleLineRight.y = player.y;
					AngleLineLeft.visible = true;
					AngleLineRight.visible = true;
					DirectionArrow.x = player.x;
					DirectionArrow.y = player.y;
					this.setArrow(); //Cuando se ha realizado todo el proceso, llamamos al servidor para que se actualice en el mismo, y pueda llegar la información a los demás jugadores
					//Esta funcion comprueba en cada movimiento si el jugador ha llegado a la meta
					if (this.checkWin(player.x, player.y)) {
						goalOrder.push(1);
						playerState = 2;//Cambiamos el estado del jugador
						player.arrived = true; //Decimos que el jugador a llegado
						if (player.arrived)
							this.updateMeta(); //Llamamos al servidor para decir quién ha llegado a la meta
						//Descactivamos los controles del jugador para que no pueda moverse
						AngleLineLeft.visible = false;
						AngleLineRight.visible = false;
						DirectionArrow.visible = false;
					}
				}

			}
			game.player.x = player.x;
			game.player.y = player.y;

			game.player.angle = player.angle;
			//Llamamos a la función del servidor que actualiza la posición de los jugadores, y comprobamos si el jugador ha llegado, en caso afirmativo
			//llamamos a la función que actualiza en el servidor si el jugador ha llegado a la meta.
			this.sendPlayerUpdate();
			if (player.arrived)
				this.getMeta();

			this.updatePlayers(function (data) {
				//CÓDIGO ACTUALIZAR ESTADO JUGADORES
				if (game.playersData == null)
					game.playersData = JSON.parse(JSON.stringify(data));
				var count = 0;
				var numeroMeta = 0;
				game.playersDataNew = JSON.parse(JSON.stringify(data));

				//Recorremos toda la lista de jugadores, para comprobar su posición y actualizar la posición del jugador que estamos manejando nosotros,
				//y le mandamos la información actualizada al servidor
				for (var i = 0; i < game.numPlayers; i++) {
					if (i != game.player.id - 1) {
						if ((game.altPlayers.children[count].x !== game.playersDataNew[i].x
							|| game.altPlayers.children[count].y !== game.playersDataNew[i].y)
							&& hasStarted) {
							var line = game.add.sprite(game.altPlayers.children[count].x, game.altPlayers.children[count].y,
								'angleLine' + i);
							line.angle = (Phaser.Math.angleBetween(game.altPlayers.children[count].x, game.altPlayers.children[count].y,
								game.playersDataNew[i].x, game.playersDataNew[i].y) * (180 / Math.PI));
							var lineScale = Phaser.Math.linear(0, 1, Phaser.Math.distance(game.altPlayers.children[count].x, game.altPlayers.children[count].y,
								game.playersDataNew[i].x, game.playersDataNew[i].y) / (2 * AngleLineLeft.width));
							line.scale.setTo(lineScale, 0.3);
						}
						//Actualizamos el valor de la posición y el ángulo del jugador respecto del servidor, para que los demás jugadores vean dónde
						//están los jugadores en todo momento.
						game.altPlayers.children[count].x = game.playersDataNew[i].x;
						game.altPlayers.children[count].y = game.playersDataNew[i].y;
						game.altPlayers.children[count].angle = game.playersDataNew[i].angle;
						count++;
					}
				}
				game.playersData = game.playersDataNew;
			});
		},
		//Esta funcion corresponde con una llamada GET al servidor mediante la cual, en el apartado /players actualizamos la información de los jugadores
		//dentro del servidor, para que sea común a todos los mismos.
		updatePlayers: function (callback) {
			$.ajax({
				method: "GET",
				url: 'http://localhost:8080/players',
				processData: false,
				headers: {
					"Content-Type": "application/json"
				}
			}).done(function (data) {
				game.playersDataNew = JSON.parse(JSON.stringify(data));
				callback(JSON.parse(JSON.stringify(data)));
			})
		},
		//Esta funcion corresponde con una llamada GET al servidor mediante la cual, en el apartado /meta/add actualizamos el número de jugadores que ha llegado
		//a la meta. Si ese número es igual al número de jugadores en la partida, se pasa al siguiente estado. Cuando llega un jugador a la meta, guarda su id y
		//le asigna una puntuación correspondiente
		updateMeta: function(){
			$.ajax({
				method: "GET",
				url: 'http://localhost:8080/meta/add',
				processData: false,
				headers: {
					"Content-Type": "application/json"
				}
			}).done(function (data) {
				numeroMeta = JSON.parse(JSON.stringify(data));
					game.player.score += 100 - ((numeroMeta - 1) * 10);
				if (numeroMeta == game.numPlayers)
					game.state.start("scoreOnlineState");
			})
		},
		//Esta función corresponde con una llamada GET al servidor mediante la cual, en el apartado /meta/add 
		//obtenemos el número de jugadores que han llegado a la meta en todo momento
		getMeta: function () {
			$.ajax({
				method: "GET",
				url: 'http://localhost:8080/meta',
				processData: false,
				headers: {
					"Content-Type": "application/json"
				}
			}).done(function (data) {
				numeroMeta = JSON.parse(JSON.stringify(data));
				if (numeroMeta == game.numPlayers)
					game.state.start("scoreOnlineState");
			})
		},
		//Esta función corresponde con una llamada PUT al servidor mediante la cual, en el apartado /player/playerId actualizamos la información 
		//de nuestro jugador dentro del servidor.
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
		//Esta función corresponde con una llamada al servidor mediante la cual, en el apartado player/number obtenemos el número de jugadores
		//que existen ahora mismo en la partida
		getNumPlayers: function (callback) {
			$.ajax({
				url: 'http://localhost:8080/player/number',
			}).done(function (data) {
				console.log("Hay " + JSON.stringify(data) + " jugadores")
				callback(JSON.parse(JSON.stringify(data)));
			})
		},
		//Esta función corresponde con una llamada POST al servidor mediante la cual, en el apartado game/timer/time establecemos un temporizador
		//para hacer el semáforo que tenemos al principio
		setTimer: function (time) {
			$.ajax({
				method: "POST",
				url: 'http://localhost:8080/game/timer/' + time,
				processData: false,
				headers: {
					"Content-Type": "application/json"
				},
			}).done(function (data) {
			})
		},
		//Esta función corresponde con una llamada GET al servidor mediante la cual, en el apartado game/timer mediante el cual actualizamos la información
		//del semáforo para que todos los jugadores puedan ver el semáforo actualizado
		updateTimer: function (callback) {

			$.ajax({
				method: "GET",
				url: 'http://localhost:8080/game/timer',
				processData: false,
				headers: {
					"Content-Type": "application/json"
				},
			}).done(function (data) {
				callback(JSON.parse(JSON.stringify(data)));
			})
		},

		//comprobamos si se puede mover un jugador a una posición o da a un muro
		//Para ello recibimos la posición a comprobar y en ella generamos un sprite sin imagen
		//Luego creamos un collider circular de 1 pixel de radio para ese objeto y usamos hitscan para ver
		//si colisiona con los muros. Devolvemos un booleano en base al resultado.
		//VARIABLES DE ENTRADA: Coordenadas X e Y respectivamente del punto a comprobar
		//VARIABLES DE SALIDA: Un booleano, true si no hay colisión con los muros, false en caso contrario
		checkPos: function (checkPositionX, checkPositionY) {
			checkPoint = game.add.sprite(checkPositionX, checkPositionY);
			var point = new Phaser.Point(checkPositionX, checkPositionY);
			game.physics.p2.enable(checkPoint, true);

			checkPoint.body.x += checkPoint.width / 2;
			checkPoint.body.y += checkPoint.height / 2;

			checkPoint.body.clearShapes();
			checkPoint.body.setCircle(1);
			var check = game.physics.p2.hitTest(point, [walls.body]);
			checkPoint.destroy();
			if (check.length)
				return false;
			else
				return true;
		},

		//comprobamos si una posición se encuentra en la meta
		//Para ello recibimos la posición a comprobar y en ella generamos un sprite sin imagen
		//Luego creamos un collider circular de 1 pixel de radio para ese objeto y usamos hitscan para ver
		//si colisiona con la meta. Devolvemos un booleano en base al resultado.
		//VARIABLES DE ENTRADA: Coordenadas X e Y respectivamente del punto a comprobar
		//VARIABLES DE SALIDA: Un booleano, true si  hay colisión con la meta, false en caso contrario
		checkWin: function (checkPositionX, checkPositionY) {
			checkPoint = game.add.sprite(checkPositionX, checkPositionY);
			var point = new Phaser.Point(checkPositionX, checkPositionY);
			game.physics.p2.enable(checkPoint, true);
			checkPoint.body.clearShapes();
			checkPoint.body.setCircle(1);
			var check = game.physics.p2.hitTest(point, [goal.body]);
			checkPoint.destroy();
			if (check.length)
				return true;
			else
				return false;
		},

		//cambiamos el estado del primer jugador y hacemos las comprobaciones y acciones necesarias dados estos cambios de estado,
		//viendo si el jugador puede moverse a la posición que ha elegido y en caso afirmativo viendo si esa posición está en la meta.
		//En su estado 0 el jugador elegirá el ángulo de lanzamiento por lo que su flecha direccional se moverá en un ángulo y a su vez
		//el jugador podrá mover ese ángulo.
		//En el estado 1 el jugador ya ha decidido su ángulo y no puede modificarlo, por lo que estará escogiendo la distancia que recorre.
		//La flecha crecerá y decrecerá intermitentemente en este estado y al decidirse una distancia se comprobará si el punto elegido
		//está dentro de un muro y en caso negativo si está en la meta.
		//Si puede moverse lo hará y si no ha dado con la meta o no se ha movido pasará al estado 0 de nuevo.
		//El estado 2 hace que el jugador esté inactivo. Se usa antes de empezar la carrera y al llegar a la meta
		changeState: function () {

			if (playerState === 0) {
				playerState = 1;
				timeCounter = game.rnd.integerInRange(0, 50) / 100;
				playerArrowDirection = true;
				AngleLineLeft.visible = false;
				AngleLineRight.visible = false;
			}
			else if (playerState === 1) {
				var positionXcheck = Math.cos(DirectionArrow.rotation) * DirectionArrow.width;
				var positionYcheck = Math.sin(DirectionArrow.rotation) * DirectionArrow.width;
				playerState = 0;
				AngleLineLeft.visible = true;
				AngleLineRight.visible = true;
				if (this.checkPos(positionXcheck + DirectionArrow.x, positionYcheck + DirectionArrow.y)
					&& positionXcheck + DirectionArrow.x > 0 && positionXcheck + DirectionArrow.x < 800
					&& positionYcheck + DirectionArrow.y > 0 && positionYcheck + DirectionArrow.y < 600) {
					playerStartMovePositionX = player.x;
					playerStartMovePositionY = player.y;
					playerFinalMovePositionX = positionXcheck + DirectionArrow.x;
					playerFinalMovePositionY = positionYcheck + DirectionArrow.y;
					playerState = 3;
					timeCounter = 0;
					AngleLineLeft.visible = false;
					AngleLineRight.visible = false;
				}
				DirectionArrow.scale.setTo(0.4, 0.3);
			}
		},

		//Reasignamos un ángulo aleatorio a la flecha de dirección del primer jugador
		setArrow: function () {
			var angle = game.rnd.integerInRange(0, 60);
			timeCounter = game.math.linear(0, 0.5, angle / 60);
			DirectionArrow.angle = AngleLineRight.angle - angle;
			playerArrowDirection = true;
		},

		//Hacemos que gire la flecha del primer jugador con una interpolación y un contador de tiempo.
		moveArrow: function () {
			timeCounter += game.time.elapsedMS / 1000;
			if (playerArrowDirection) {
				DirectionArrow.angle = AngleLineLeft.angle + game.math.linear(0, 60, timeCounter / 0.5);
			}
			else {
				DirectionArrow.angle = AngleLineRight.angle - game.math.linear(0, 60, timeCounter / 0.5);
			}
			if (timeCounter >= 0.5) {
				timeCounter = 0;
				playerArrowDirection = !playerArrowDirection;
			}
		},

		//cambiamos el tamaño de la flecha y ajustamos la distancia del movimiento del primer jugador con una interpolación
		//y un contador de tiempo
		powerArrow: function () {
			timeCounter += game.time.elapsedMS / 1000;
			if (timeCounter > 0.5) {
				timeCounter = 0;
				playerArrowDirection = !playerArrowDirection;
			}
			if (playerArrowDirection) {
				var length = game.math.linear(0, 0.4, timeCounter / 0.5);
				DirectionArrow.scale.setTo(length, 0.3);
			}
			else {
				var length = game.math.linear(0, 0.4, (0.5 - timeCounter) / 0.5);
				DirectionArrow.scale.setTo(length, 0.3);
			}
		}
	}



