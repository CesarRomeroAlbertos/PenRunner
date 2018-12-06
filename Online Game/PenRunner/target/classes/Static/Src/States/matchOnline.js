PenRunner.matchOnlineState = function (game) { }

PenRunner.matchOnlineState.prototype =
	{
		create: function () {
			this.getNumPlayers(function (data) {
				game.numPlayers = data;
			});
			console.log("número de jugadores: " + game.numPlayers);
			//nos aseguramos de que el fondo sea blanco	
			game.stage.backgroundColor = "#FFFFFF";

			//cogemos los jsons necesarios de la cache
			var trackJson = game.cache.getJSON('track');

			//metemos los sprites con sus colliders cuando son necesarios, todo leyendo del json del circuito,
			//y con las variables del mismo colocamos todo y construimos el circuito además de activar sus físicas
			walls = game.add.sprite(trackJson.wallsPositionX, trackJson.wallsPositionY, 'walls');
			start = game.add.sprite(trackJson.startPositionX, trackJson.startPositionY, 'start');
			goal = game.add.sprite(trackJson.goalPositionX, trackJson.goalPositionY, 'goal');

			start.angle = trackJson.startRotation;
			start.scale.setTo(trackJson.startScaleX, 1);
			goal.angle = trackJson.goalRotation;
			goal.scale.setTo(trackJson.goalScaleX, 1);

			game.physics.p2.enable(goal, true);
			for (var i = 0; i < goal.body.data.shapes.length; i++)
				goal.body.data.shapes[i].sensor = true;

			goal.body.static = true;
			goal.body.x += goal.width / 2;
			goal.body.y += goal.height / 2;
			goal.body.debug = false;

			game.physics.p2.enable(walls, true);
			walls.body.x += walls.width / 2;
			walls.body.y += walls.height / 2;

			walls.body.clearShapes();
			walls.body.loadPolygon('wallsCollision', 'wallsTrack');
			walls.body.static = true;
			walls.body.debug = false;
			for (var i = 0; i < walls.body.data.shapes.length; i++) {
				walls.body.data.shapes[i].sensor = true;
			}

			player = game.add.sprite(game.math.linear(trackJson.playerPositionXzero, trackJson.playerPositionXone, game.player.id / (game.numPlayers + 2)),
				game.math.linear(trackJson.playerPositionYzero, trackJson.playerPositionYone, game.player.id / (game.numPlayers + 2)),
				'player' + (game.player.id - 1));
			player.anchor.setTo(0, 0);
			player.scale.setTo(0.15, 0.15);
			player.angle += trackJson.playerAngle;

			game.player.x = player.x;
			game.player.y = player.y;

			game.player.angle = player.angle;

			this.sendPlayerUpdate();

			//var game.altPlayers;



			if (game.numPlayers > 1) {

				game.altPlayers = game.add.group();

				var altCount = 0;
				for (var i = 0; i < game.numPlayers; i++) {
					if (i != (game.player.id - 1)) {
						game.altPlayers.create(game.math.linear(trackJson.playerPositionXzero, trackJson.playerPositionXone, (i + 1) / (game.numPlayers + 2)),
							game.math.linear(trackJson.playerPositionYzero, trackJson.playerPositionYone, (i + 1) / (game.numPlayers + 2)),
							'player' + i);
						game.altPlayers.children[altCount].anchor.setTo(0, 0);
						game.altPlayers.children[altCount].scale.setTo(0.15, 0.15);
						game.altPlayers.children[altCount].angle += trackJson.playerAngle;
						altCount++;
					}
				}
			}


			//flecha y ángulo del primer jugador
			AngleLineLeft = game.add.sprite(player.x, player.y, 'angleLine');
			AngleLineRight = game.add.sprite(player.x, player.y, 'angleLine');
			DirectionArrow = game.add.sprite(player.x, player.y, 'angleLine' + (game.player.id - 1));

			AngleLineLeft.anchor.setTo(0, 0.5);
			AngleLineLeft.angle = trackJson.directionAngle - 30;
			AngleLineRight.anchor.setTo(0, 0.5);
			AngleLineRight.angle = trackJson.directionAngle + 30;
			DirectionArrow.anchor.setTo(0, 0.5);
			DirectionArrow.angle = trackJson.directionAngle;

			AngleLineLeft.scale.setTo(0.5, 0.5);
			AngleLineRight.scale.setTo(0.5, 0.5);
			DirectionArrow.scale.setTo(0.4, 0.3);


			//controles

			leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
			rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
			forwardKey = game.input.keyboard.addKey(Phaser.Keyboard.W);


			forwardKey.onDown.add(this.changeState, this);


			//inicializamos variables de la escena

			playerState = 2;

			playerArrowDirection = true;

			timeCounter = 0;

			goalOrder = new Array();

			this.setArrow();


			//semaforo
			semaforo = game.add.sprite(game.world.centerX, game.world.centerY, 'semaforo');
			semaforo.scale.setTo(1 / 3, 1 / 3);
			semaforo.x -= semaforo.width / 2;
			semaforo.y -= semaforo.height / 2;

			semaforoAnimation = semaforo.animations.add('semaforoAnim');

			this.setTimer(semaforoAnimation.frameTotal * 1000);
			hasStarted = false;

			//timerSemaforo = game.time.events.loop(Phaser.Timer.SECOND, semaforoCounter, this);

			this.updatePlayers(function (data) {
				//CÓDIGO ACTUALIZAR ESTADO JUGADORES
				game.playersData = JSON.parse(JSON.stringify(data));
			});

		},

		//usamos update para los distintos controles de la partida
		update: function () {
			if (!hasStarted) {
				this.updateTimer(function (data) {

					//console.log("tiempo recibido: " + data + " /n tiempo restante: " + 4 - data / 1000);
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
				this.moveArrow();
			}
			else if (playerState == 1) {
				this.powerArrow();
			}
			else if (playerState == 3) {
				timeCounter += game.time.elapsedMS / 1000;
				player.x = game.math.linear(playerStartMovePositionX, playerFinalMovePositionX,
					Math.min(timeCounter / 0.3, 1));
				player.y = game.math.linear(playerStartMovePositionY, playerFinalMovePositionY,
					Math.min(timeCounter / 0.3, 1));
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
					//DirectionArrow.scale.setTo(0.4, 0.3);
					this.setArrow();
					if (this.checkWin(player.x, player.y)) {
						goalOrder.push(1);
						playerState = 2;
						AngleLineLeft.visible = false;
						AngleLineRight.visible = false;
						DirectionArrow.visible = false
					}
				}
			}

			game.player.x = player.x;
			game.player.y = player.y;

			game.player.angle = player.angle;

			this.sendPlayerUpdate();

			this.updatePlayers(function (data) {
				//CÓDIGO ACTUALIZAR ESTADO JUGADORES
				if (game.playersData == null)
					game.playersData = JSON.parse(JSON.stringify(data));
				var count = 0;
				game.playersDataNew = JSON.parse(JSON.stringify(data));


				for (var i = 0; i < game.numPlayers; i++) {
					if (i != game.player.id - 1) {
						if ((game.altPlayers.children[count].x !== game.playersDataNew[i].x
							|| game.altPlayers.children[count].y !== game.playersDataNew[i].y)
							&& hasStarted) {
							console.log(game.altPlayers.children[count].x);
							var line = game.add.sprite(game.altPlayers.children[count].x, game.altPlayers.children[count].y,
								'angleLine' + i);
							line.angle = (Phaser.Math.angleBetween(game.altPlayers.children[count].x, game.altPlayers.children[count].y,
								game.playersDataNew[i].x, game.playersDataNew[i].y) * (180 / Math.PI));
							var lineScale = Phaser.Math.linear(0, 1, Phaser.Math.distance(game.altPlayers.children[count].x, game.altPlayers.children[count].y,
								game.playersDataNew[i].x, game.playersDataNew[i].y) / (2 * AngleLineLeft.width));
							line.scale.setTo(lineScale, 0.3);
							//console.log(line);
						}
						game.altPlayers.children[count].x = game.playersDataNew[i].x;
						game.altPlayers.children[count].y = game.playersDataNew[i].y;
						game.altPlayers.children[count].angle = game.playersDataNew[i].angle;
						count++;
					}
				}
				game.playersData = game.playersDataNew;
			});

			/*//aquí comprobamos que han llegado ambos jugadores a la meta
			if (goalOrder.length >= 2) {
				game.state.start('scoreState');
			}*/
		},

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

		sendPlayerUpdate: function () {
			$.ajax({
				method: "PUT",
				url: 'http://localhost:8080/player/' + game.player.id,
				data: JSON.stringify(game.player),
				processData: false,
				headers: {
					"Content-Type": "application/json"
				}
			}).done(function (data) { })
		},

		getNumPlayers: function (callback) {
			$.ajax({
				url: 'http://localhost:8080/player/number',
			}).done(function (data) {
				console.log("Hay " + JSON.stringify(data) + " jugadores")
				callback(JSON.parse(JSON.stringify(data)));
				//game.numPlayers = JSON.parse(JSON.stringify(data));
			})
		},

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



