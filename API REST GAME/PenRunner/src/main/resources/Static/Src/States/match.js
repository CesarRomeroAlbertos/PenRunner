PenRunner.matchState = function (game) { }


PenRunner.matchState.prototype =
	{
		create: function () {
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

			player1 = game.add.sprite(game.math.linear(trackJson.playerPositionXzero, trackJson.playerPositionXone, 1 / 3),
				game.math.linear(trackJson.playerPositionYzero, trackJson.playerPositionYone, 1 / 3), 'player1');
			player1.anchor.setTo(0, 0);
			player1.scale.setTo(0.15, 0.15);
			player1.angle += trackJson.playerAngle;
			player2 = game.add.sprite(game.math.linear(trackJson.playerPositionXzero, trackJson.playerPositionXone, 2 / 3),
				game.math.linear(trackJson.playerPositionYzero, trackJson.playerPositionYone, 2 / 3), 'player2');
			player2.anchor.setTo(0, 0);
			player2.scale.setTo(0.15, 0.15);
			player2.angle += trackJson.playerAngle;

			//flecha y ángulo del primer jugador
			AngleLineLeftP1 = game.add.sprite(player1.x, player1.y, 'angleLine');
			AngleLineRightP1 = game.add.sprite(player1.x, player1.y, 'angleLine');
			DirectionArrowP1 = game.add.sprite(player1.x, player1.y, 'angleLineBlue');

			AngleLineLeftP1.anchor.setTo(0, 0.5);
			AngleLineLeftP1.angle = trackJson.directionAngle - 30;
			AngleLineRightP1.anchor.setTo(0, 0.5);
			AngleLineRightP1.angle = trackJson.directionAngle + 30;
			DirectionArrowP1.anchor.setTo(0, 0.5);
			DirectionArrowP1.angle = trackJson.directionAngle;

			AngleLineLeftP1.scale.setTo(0.5, 0.5);
			AngleLineRightP1.scale.setTo(0.5, 0.5);
			DirectionArrowP1.scale.setTo(0.4, 0.3);

			//flecha y ángulo del segundo jugador

			AngleLineLeftP2 = game.add.sprite(player2.x, player2.y, 'angleLine');
			AngleLineRightP2 = game.add.sprite(player2.x, player2.y, 'angleLine');
			DirectionArrowP2 = game.add.sprite(player2.x, player2.y, 'angleLineRed');

			AngleLineLeftP2.anchor.setTo(0, 0.5);
			AngleLineLeftP2.angle = trackJson.directionAngle - 30;
			AngleLineRightP2.anchor.setTo(0, 0.5);
			AngleLineRightP2.angle = trackJson.directionAngle + 30;
			DirectionArrowP2.anchor.setTo(0, 0.5);
			DirectionArrowP2.angle = trackJson.directionAngle;

			AngleLineLeftP2.scale.setTo(0.5, 0.5);
			AngleLineRightP2.scale.setTo(0.5, 0.5);
			DirectionArrowP2.scale.setTo(0.4, 0.3);

			//controles

			leftKeyP1 = game.input.keyboard.addKey(Phaser.Keyboard.A);
			rightKeyP1 = game.input.keyboard.addKey(Phaser.Keyboard.D);
			forwardKeyP1 = game.input.keyboard.addKey(Phaser.Keyboard.W);
			leftKeyP2 = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
			rightKeyP2 = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
			forwardKeyP2 = game.input.keyboard.addKey(Phaser.Keyboard.UP);

			forwardKeyP1.onDown.add(this.changeState1, this);
			forwardKeyP2.onDown.add(this.changeState2, this);

			//inicializamos variables de la escena

			player1State = 2;
			player2State = 2;
			player1ArrowDirection = true;
			player2ArrowDirection = true;
			timeCounter1 = 0;
			timeCounter2 = 0;
			goalOrder = new Array();

			this.setArrow1();
			this.setArrow2();

			//semaforo
			semaforo = game.add.sprite(game.world.centerX, game.world.centerY, 'semaforo');
			semaforo.scale.setTo(1 / 3, 1 / 3);
			semaforo.x -= semaforo.width / 2;
			semaforo.y -= semaforo.height / 2;

			semaforoAnimation = semaforo.animations.add('semaforoAnim');

			timerSemaforo = game.time.events.loop(Phaser.Timer.SECOND, this.semaforoCounter, this);

		},

		//usamos update para los distintos controles de la partida
		update: function () {

			//tecla izquierda jugador 1
			if (leftKeyP1.isDown && player1State == 0) {
				AngleLineLeftP1.angle -= 5;
				AngleLineRightP1.angle -= 5;
				player1.angle -= 5;
			}
			//tecla derecha jugador 1
			else if (rightKeyP1.isDown && player1State == 0) {
				AngleLineLeftP1.angle += 5;
				AngleLineRightP1.angle += 5;
				player1.angle += 5;
			}
			//tecla izquierda jugador 2
			if (leftKeyP2.isDown && player2State == 0) {
				AngleLineLeftP2.angle -= 5;
				AngleLineRightP2.angle -= 5;
				player2.angle -= 5;
			}
			//tecla derecha jugador 2
			else if (rightKeyP2.isDown && player2State == 0) {
				AngleLineLeftP2.angle += 5;
				AngleLineRightP2.angle += 5;
				player2.angle += 5;
			}
			//aquí llamamos a los métodos que giran la dirección de los jugadores o cambian la distancia que se mueven en función de su estado
			if (player1State == 0) {
				this.moveArrow1();
			}
			else if (player1State == 1) {
				this.powerArrow1();
			}
			else if (player1State == 3) {
				timeCounter1 += game.time.elapsedMS / 1000;
				player1.x = game.math.linear(player1StartMovePositionX, player1FinalMovePositionX,
					Math.min(timeCounter1 / 0.3, 1));
				player1.y = game.math.linear(player1StartMovePositionY, player1FinalMovePositionY,
					Math.min(timeCounter1 / 0.3, 1));
				if (timeCounter1 >= 0.3) {
					player1State = 0;
					var line = game.add.sprite(player1StartMovePositionX, player1StartMovePositionY, 'angleLineBlue');
					line.angle = DirectionArrowP1.angle;
					line.scale.setTo(DirectionArrowP1.scale.x, DirectionArrowP1.scale.y);
					AngleLineLeftP1.x = player1.x;
					AngleLineLeftP1.y = player1.y;
					AngleLineRightP1.x = player1.x;
					AngleLineRightP1.y = player1.y;
					AngleLineLeftP1.visible = true;
					AngleLineRightP1.visible = true;
					DirectionArrowP1.x = player1.x;
					DirectionArrowP1.y = player1.y;
					DirectionArrowP1.scale.setTo(0.4, 0.3);
					this.setArrow1();
					if (this.checkWin(player1.x, player1.y)) {
						goalOrder.push(1);
						player1State = 2;
						AngleLineLeftP1.visible = false;
						AngleLineRightP1.visible = false;
						DirectionArrowP1.visible = false
					}
				}
			}

			if (player2State == 0) {
				this.moveArrow2();
			}
			else if (player2State == 1) {
				this.powerArrow2();
			}
			else if (player2State == 3) {
				timeCounter2 += game.time.elapsedMS / 1000;
				player2.x = game.math.linear(player2StartMovePositionX, player2FinalMovePositionX,
					Math.min(timeCounter2 / 0.3, 1));
				player2.y = game.math.linear(player2StartMovePositionY, player2FinalMovePositionY,
					Math.min(timeCounter2 / 0.3, 1));
				if (timeCounter2 >= 0.3) {
					player2State = 0;
					var line = game.add.sprite(player2StartMovePositionX, player2StartMovePositionY, 'angleLineRed');
					line.angle = DirectionArrowP2.angle;
					console.log("escala:");
					line.scale.setTo(DirectionArrowP2.scale.x, DirectionArrowP2.scale.y);
					console.log(DirectionArrowP2.scale.x);
					AngleLineLeftP2.x = player2.x;
					AngleLineLeftP2.y = player2.y;
					AngleLineRightP2.x = player2.x;
					AngleLineRightP2.y = player2.y;
					AngleLineLeftP2.visible = true;
					AngleLineRightP2.visible = true;
					DirectionArrowP2.x = player2.x;
					DirectionArrowP2.y = player2.y;
					this.setArrow2();
					if (this.checkWin(player2.x, player2.y)) {
						goalOrder.push(2);
						player2State = 2;
						AngleLineLeftP2.visible = false;
						AngleLineRightP2.visible = false;
						DirectionArrowP2.visible = false
					}
				}
			}
			//aquí comprobamos que han llegado ambos jugadores a la meta
			if (goalOrder.length >= 2) {
				game.state.start('scoreState');
			}
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
		changeState1: function () {

			if (player1State === 0) {
				player1State = 1;
				timeCounter1 = game.rnd.integerInRange(0, 50) / 100;
				player1ArrowDirection = true;
				AngleLineLeftP1.visible = false;
				AngleLineRightP1.visible = false;
			}
			else if (player1State === 1) {
				var positionXcheck = Math.cos(DirectionArrowP1.rotation) * DirectionArrowP1.width;
				var positionYcheck = Math.sin(DirectionArrowP1.rotation) * DirectionArrowP1.width;
				player1State = 0;
				AngleLineLeftP1.visible = true;
				AngleLineRightP1.visible = true;
				if (this.checkPos(positionXcheck + DirectionArrowP1.x, positionYcheck + DirectionArrowP1.y)
					&& positionXcheck + DirectionArrowP1.x > 0 && positionXcheck + DirectionArrowP1.x < 800
					&& positionYcheck + DirectionArrowP1.y > 0 && positionYcheck + DirectionArrowP1.y < 600) {
					player1StartMovePositionX = player1.x;
					player1StartMovePositionY = player1.y;
					player1FinalMovePositionX = positionXcheck + DirectionArrowP1.x;
					player1FinalMovePositionY = positionYcheck + DirectionArrowP1.y;
					player1State = 3;
					timeCounter1 = 0;
					AngleLineLeftP1.visible = false;
					AngleLineRightP1.visible = false;
				}

			}
		},

		//cambiamos el estado del segundo jugador y hacemos las comprobaciones y acciones necesarias dados estos cambios de estado,
		//viendo si el jugador puede moverse a la posición que ha elegido y en caso afirmativo viendo si esa posición está en la meta
		//En su estado 0 el jugador elegirá el ángulo de lanzamiento por lo que su flecha direccional se moverá en un ángulo y a su vez
		//el jugador podrá mover ese ángulo.
		//En el estado 1 el jugador ya ha decidido su ángulo y no puede modificarlo, por lo que estará escogiendo la distancia que recorre.
		//La flecha crecerá y decrecerá intermitentemente en este estado y al decidirse una distancia se comprobará si el punto elegido
		//está dentro de un muro y en caso negativo si está en la meta.
		//Si puede moverse lo hará y si no ha dado con la meta o no se ha movido pasará al estado 0 de nuevo.
		//El estado 2 hace que el jugador esté inactivo. Se usa antes de empezar la carrera y al llegar a la meta
		changeState2: function () {

			if (player2State === 0) {
				player2State = 1;
				timeCounter2 = game.rnd.integerInRange(0, 50) / 100;
				player2ArrowDirection = true;
				AngleLineLeftP2.visible = false;
				AngleLineRightP2.visible = false;
			}
			else if (player2State === 1) {
				var positionXcheck = Math.cos(DirectionArrowP2.rotation) * DirectionArrowP2.width;
				var positionYcheck = Math.sin(DirectionArrowP2.rotation) * DirectionArrowP2.width;
				player2State = 0;
				AngleLineLeftP2.visible = true;
				AngleLineRightP2.visible = true;
				if (this.checkPos(positionXcheck + DirectionArrowP2.x, positionYcheck + DirectionArrowP2.y)
					&& positionXcheck + DirectionArrowP2.x > 0 && positionXcheck + DirectionArrowP2.x < 800
					&& positionYcheck + DirectionArrowP2.y > 0 && positionYcheck + DirectionArrowP2.y < 600) {
					player2StartMovePositionX = player2.x;
					player2StartMovePositionY = player2.y;
					player2FinalMovePositionX = positionXcheck + DirectionArrowP2.x;
					player2FinalMovePositionY = positionYcheck + DirectionArrowP2.y;
					player2State = 3;
					timeCounter2 = 0;
					AngleLineLeftP2.visible = false;
					AngleLineRightP2.visible = false;
				}

			}
		},

		//Reasignamos un ángulo aleatorio a la flecha de dirección del primer jugador
		setArrow1: function () {
			var angle = game.rnd.integerInRange(0, 60);
			timeCounter1 = game.math.linear(0, 0.5, angle / 60);
			DirectionArrowP1.angle = AngleLineRightP1.angle - angle;
			player1ArrowDirection = true;
			DirectionArrowP1.scale.setTo(0.4, 0.3);
		},

		//Reasignamos un ángulo aleatorio a la flecha de dirección del segundo jugador
		setArrow2: function () {
			var angle = game.rnd.integerInRange(0, 60);
			timeCounter2 = game.math.linear(0, 0.5, angle / 60);
			DirectionArrowP2.angle = AngleLineRightP2.angle - angle;
			player2ArrowDirection = true;
			DirectionArrowP2.scale.setTo(0.4, 0.3);
		},

		//Hacemos que gire la flecha del primer jugador con una interpolación y un contador de tiempo.
		moveArrow1: function () {
			timeCounter1 += game.time.elapsedMS / 1000;
			if (player1ArrowDirection) {
				DirectionArrowP1.angle = AngleLineLeftP1.angle + game.math.linear(0, 60, timeCounter1 / 0.5);
			}
			else {
				DirectionArrowP1.angle = AngleLineRightP1.angle - game.math.linear(0, 60, timeCounter1 / 0.5);
			}
			if (timeCounter1 >= 0.5) {
				timeCounter1 = 0;
				player1ArrowDirection = !player1ArrowDirection;
			}
		},

		//Hacemos que gire la flecha del segundo jugador con una interpolación y un contador de tiempo.
		moveArrow2: function () {
			timeCounter2 += game.time.elapsedMS / 1000;
			if (player2ArrowDirection) {
				DirectionArrowP2.angle = AngleLineLeftP2.angle + game.math.linear(0, 60, timeCounter2 / 0.5);
			}
			else {
				DirectionArrowP2.angle = AngleLineRightP2.angle - game.math.linear(0, 60, timeCounter2 / 0.5);
			}
			if (timeCounter2 >= 0.5) {
				timeCounter2 = 0;
				player2ArrowDirection = !player2ArrowDirection;
			}
		},

		//cambiamos el tamaño de la flecha y ajustamos la distancia del movimiento del primer jugador con una interpolación
		//y un contador de tiempo
		powerArrow1: function () {
			timeCounter1 += game.time.elapsedMS / 1000;
			if (timeCounter1 > 0.5) {
				timeCounter1 = 0;
				player1ArrowDirection = !player1ArrowDirection;
			}
			if (player1ArrowDirection) {
				var length = game.math.linear(0, 0.4, timeCounter1 / 0.5);
				DirectionArrowP1.scale.setTo(length, 0.3);
			}
			else {
				var length = game.math.linear(0, 0.4, (0.5 - timeCounter1) / 0.5);
				DirectionArrowP1.scale.setTo(length, 0.3);
			}
		},

		//cambiamos el tamaño de la flecha y ajustamos la distancia del segundo del segundo jugador con una interpolación
		//y un contador de tiempo
		powerArrow2: function () {
			timeCounter2 += game.time.elapsedMS / 1000;
			if (timeCounter2 >= 0.5) {
				timeCounter2 = 0;
				player2ArrowDirection = !player2ArrowDirection;
			}
			if (player2ArrowDirection) {
				var length = game.math.linear(0, 0.4, timeCounter2 / 0.5);
				DirectionArrowP2.scale.setTo(length, 0.3);
			}
			else {
				var length = game.math.linear(0, 0.4, (0.5 - timeCounter2) / 0.5);
				DirectionArrowP2.scale.setTo(length, 0.3);
			}
		},
		//Esta función se utiliza para avanzar la animación del semáforo inicial
		//y activar los controles de los jugadores una vez esta ha terminado
		semaforoCounter: function () {
			if (semaforoAnimation.frame < semaforoAnimation.frameTotal - 1) {
				semaforoAnimation.frame += 1;
			}
			else {
				player1State = 0;
				player2State = 0;
				semaforo.destroy();
				game.time.events.remove(timerSemaforo);
			}
		}
	}

