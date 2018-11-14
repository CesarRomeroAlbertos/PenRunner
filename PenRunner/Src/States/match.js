PenRunner.matchState = function(game) {}

//variable global donde están encapsuladas las variables a las que necesitamos acceder desde fuera del prototype de la escena
var match={};
function matchData(){return this;}

PenRunner.matchState.prototype =
{
	create: function()
	{
		match = matchData();
		//nos aseguramos de que el fondo sea blanco	
		game.stage.backgroundColor = "#FFFFFF";

		//cogemos los jsons necesarios de la cache
		var trackJson = game.cache.getJSON('track');

		//metemos los sprites con sus colliders cuando son necesarios, todo leyendo del json del circuito,
		//y con las variables del mismo colocamos todo y construimos el circuito además de activar sus físicas
		match.walls = game.add.sprite(trackJson.wallsPositionX,trackJson.wallsPositionY,'walls');
		start = game.add.sprite(trackJson.startPositionX,trackJson.startPositionY,'start');
		goal = game.add.sprite(trackJson.goalPositionX,trackJson.goalPositionY,'goal');

		start.angle=trackJson.startRotation;
		start.scale.setTo(trackJson.startScaleX,1);
		goal.angle=trackJson.goalRotation;
		goal.scale.setTo(trackJson.goalScaleX,1);

		game.physics.p2.enable(goal, true);
		for(var i=0; i< goal.body.data.shapes.length;i++)
			goal.body.data.shapes[i].sensor = true;
		
		goal.body.static = true;
		goal.body.x+=goal.width/2;
		goal.body.y+=goal.height/2;
		goal.body.debug=false;
		
		game.physics.p2.enable(match.walls, true);
		match.walls.body.x+=match.walls.width/2;
		match.walls.body.y+=match.walls.height/2;
		
		match.walls.body.clearShapes();
		match.walls.body.loadPolygon('wallsCollision', 'wallsTrack');
		match.walls.body.static = true;
		match.walls.body.debug=false;
		for(var i=0; i< walls.body.data.shapes.length;i++)
		{
			match.walls.body.data.shapes[i].sensor = true;
		}

		player1 = game.add.sprite(game.math.linear(trackJson.playerPositionXzero,trackJson.playerPositionXone,1/3),
		game.math.linear(trackJson.playerPositionYzero,trackJson.playerPositionYone,1/3),'player1');
		player1.anchor.setTo(0, 0);
		player1.scale.setTo(0.15,0.15);
		player1.angle += trackJson.playerAngle;
		player2 = game.add.sprite(game.math.linear(trackJson.playerPositionXzero,trackJson.playerPositionXone,2/3),
		game.math.linear(trackJson.playerPositionYzero,trackJson.playerPositionYone,2/3),'player2');
		player2.anchor.setTo(0, 0);
		player2.scale.setTo(0.15,0.15);
		player2.angle += trackJson.playerAngle;

		//flecha y ángulo del primer jugador
		AngleLineLeftP1 = game.add.sprite(player1.x,player1.y,'angleLine');
		AngleLineRightP1= game.add.sprite(player1.x,player1.y,'angleLine');
		match.DirectionArrowP1= game.add.sprite(player1.x,player1.y,'angleLineBlue');

		AngleLineLeftP1.anchor.setTo(0, 0.5);
		AngleLineLeftP1.angle=trackJson.directionAngle-30;
		AngleLineRightP1.anchor.setTo(0, 0.5);
		AngleLineRightP1.angle=trackJson.directionAngle+30;
		match.DirectionArrowP1.anchor.setTo(0, 0.5);
		match.DirectionArrowP1.angle=trackJson.directionAngle;

		AngleLineLeftP1.scale.setTo(0.5, 0.5);
		AngleLineRightP1.scale.setTo(0.5, 0.5);
		match.DirectionArrowP1.scale.setTo(0.4, 0.3);

		//flecha y ángulo del segundo jugador

		AngleLineLeftP2 = game.add.sprite(player2.x,player2.y,'angleLine');
		AngleLineRightP2= game.add.sprite(player2.x,player2.y,'angleLine');
		match.DirectionArrowP2= game.add.sprite(player2.x,player2.y,'angleLineRed');

		AngleLineLeftP2.anchor.setTo(0, 0.5);
		AngleLineLeftP2.angle=trackJson.directionAngle-30;
		AngleLineRightP2.anchor.setTo(0, 0.5);
		AngleLineRightP2.angle=trackJson.directionAngle+30;
		match.DirectionArrowP2.anchor.setTo(0, 0.5);
		match.DirectionArrowP2.angle=trackJson.directionAngle;

		AngleLineLeftP2.scale.setTo(0.5, 0.5);
		AngleLineRightP2.scale.setTo(0.5, 0.5);
		match.DirectionArrowP2.scale.setTo(0.4, 0.3);
		
		//controles

		leftKeyP1 = game.input.keyboard.addKey(Phaser.Keyboard.A);
		rightKeyP1 = game.input.keyboard.addKey(Phaser.Keyboard.D);
		forwardKeyP1 = game.input.keyboard.addKey(Phaser.Keyboard.W);
    	leftKeyP2 = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		rightKeyP2 = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		forwardKeyP2 = game.input.keyboard.addKey(Phaser.Keyboard.UP);

		forwardKeyP1.onDown.add(changeState1, this);
		forwardKeyP2.onDown.add(changeState2, this);

		//inicializamos variables de la escena

		match.player1State = 2;
		match.player2State = 2;
		match.player1ArrowDirection = true;
		match.player2ArrowDirection = true;
		match.timeCounter1 = 0;
		match.timeCounter2 = 0;
		match.goalOrder = new Array();

		setArrow1();
		setArrow2();

		//semaforo
		semaforo = game.add.sprite(game.world.centerX, game.world.centerY,'semaforo');
		semaforo.scale.setTo(1/3, 1/3);
		semaforo.x-=semaforo.width/2;
		semaforo.y-=semaforo.height/2;

		semaforoAnimation = semaforo.animations.add('semaforoAnim');

		match.timerSemaforo = game.time.events.loop(Phaser.Timer.SECOND, semaforoCounter, this);

	},

	//usamos update para los distintos controles de la partida
	update:function()
	{
		
		//tecla izquierda jugador 1
		if (leftKeyP1.isDown && match.player1State==0)
        {
			AngleLineLeftP1.angle-=5;
			AngleLineRightP1.angle-=5;
			player1.angle-=5;
		}
		//tecla derecha jugador 1
		else if (rightKeyP1.isDown && match.player1State==0)
        {
			AngleLineLeftP1.angle+=5;
			AngleLineRightP1.angle+=5;
			player1.angle+=5;
		}
		//tecla izquierda jugador 2
		if (leftKeyP2.isDown && match.player2State==0)
        {
			AngleLineLeftP2.angle-=5;
			AngleLineRightP2.angle-=5;
			player2.angle-=5;
		}
		//tecla derecha jugador 2
		else if (rightKeyP2.isDown && match.player2State==0)
        {
			AngleLineLeftP2.angle+=5;
			AngleLineRightP2.angle+=5;
			player2.angle+=5;
		}
		//aquí llamamos a los métodos que giran la dirección de los jugadores o cambian la distancia que se mueven en función de su estado
		if (match.player1State==0)
		{
			moveArrow1();
		}
		else if(match.player1State==1)
		{
			powerArrow1();
		}
		else if(match.player1State==3)
		{
			match.timeCounter1+=game.time.elapsedMS/1000;
			match.player1.x = game.math.linear(match.player1StartMovePositionX,player1FinalMovePositionX,
				Math.min(match.timeCounter1/0.3,1));
			match.player1.y = game.math.linear(match.player1StartMovePositionY,player1FinalMovePositionY,
				Math.min(match.timeCounter1/0.3,1));
			if(match.timeCounter1>=0.3)
				{
					match.player1State = 0;
					var line = game.add.sprite(match.player1StartMovePositionX,match.player1StartMovePositionY,'angleLineBlue');
					line.angle = match.DirectionArrowP1.angle;
					line.scale.setTo(match.DirectionArrowP1.scale.x, match.DirectionArrowP1.scale.y);
					AngleLineLeftP1.x=match.player1.x;
					AngleLineLeftP1.y=match.player1.y;
					AngleLineRightP1.x=match.player1.x;
					AngleLineRightP1.y=match.player1.y;
					AngleLineLeftP1.visible = true;
					AngleLineRightP1.visible = true;
					match.DirectionArrowP1.x=match.player1.x;
					match.DirectionArrowP1.y=match.player1.y;
					match.DirectionArrowP1.scale.setTo(0.4, 0.3);
					setArrow1();
					if(checkWin(match.player1.x,match.player1.y))
					{
						match.goalOrder.push(1);
						match.player1State=2;
						AngleLineLeftP1.visible = false;
						AngleLineRightP1.visible = false;
						match.DirectionArrowP1.visible = false
					}
				}
		}

		if (match.player2State==0)
		{
			moveArrow2();
		}
		else if(match.player2State==1)
		{
			powerArrow2();
		}
		else if(match.player2State==3)
		{
			match.timeCounter2+=game.time.elapsedMS/1000;
			match.player2.x = game.math.linear(match.player2StartMovePositionX,player2FinalMovePositionX,
				Math.min(match.timeCounter2/0.3,1));
			match.player2.y = game.math.linear(match.player2StartMovePositionY,player2FinalMovePositionY,
				Math.min(match.timeCounter2/0.3,1));
			if(match.timeCounter2>=0.3)
				{
					match.player2State = 0;
					var line = game.add.sprite(match.player2StartMovePositionX,match.player2StartMovePositionY,'angleLineRed');
					line.angle = match.DirectionArrowP2.angle;
					line.scale.setTo(match.DirectionArrowP2.scale.x, match.DirectionArrowP2.scale.y);
					AngleLineLeftP2.x=match.player2.x;
					AngleLineLeftP2.y=match.player2.y;
					AngleLineRightP2.x=match.player2.x;
					AngleLineRightP2.y=match.player2.y;
					AngleLineLeftP2.visible = true;
					AngleLineRightP2.visible = true;
					match.DirectionArrowP2.x=match.player2.x;
					match.DirectionArrowP2.y=match.player2.y;
					match.DirectionArrowP2.scale.setTo(0.4, 0.3);
					setArrow2();
					if(checkWin(match.player2.x,match.player2.y))
					{
						match.goalOrder.push(2);
						match.player2State=2;
						AngleLineLeftP2.visible = false;
						AngleLineRightP2.visible = false;
						match.DirectionArrowP2.visible = false
					}
				}
		}
		//aquí comprobamos que han llegado ambos jugadores a la meta
		if(match.goalOrder.length>=2)
		{
			game.state.start('scoreState');
		}
	}
}

//comprobamos si se puede mover un jugador a una posición o da a un muro
//Para ello recibimos la posición a comprobar y en ella generamos un sprite sin imagen
//Luego creamos un collider circular de 1 pixel de radio para ese objeto y usamos hitscan para ver
//si colisiona con los muros. Devolvemos un booleano en base al resultado.
//VARIABLES DE ENTRADA: Coordenadas X e Y respectivamente del punto a comprobar
//VARIABLES DE SALIDA: Un booleano, true si no hay colisión con los muros, false en caso contrario
function checkPos(checkPositionX,checkPositionY)
{
	checkPoint = game.add.sprite(checkPositionX,checkPositionY);
	var point = new Phaser.Point(checkPositionX,checkPositionY);
	game.physics.p2.enable(checkPoint, true);

	checkPoint.body.x+=checkPoint.width/2;
	checkPoint.body.y+=checkPoint.height/2;

	checkPoint.body.clearShapes();
	checkPoint.body.setCircle(1);
	var check = game.physics.p2.hitTest(point, [match.walls.body]);
	checkPoint.destroy();
	if(check.length)
		return false;
	else
		return true;
}

//comprobamos si una posición se encuentra en la meta
//Para ello recibimos la posición a comprobar y en ella generamos un sprite sin imagen
//Luego creamos un collider circular de 1 pixel de radio para ese objeto y usamos hitscan para ver
//si colisiona con la meta. Devolvemos un booleano en base al resultado.
//VARIABLES DE ENTRADA: Coordenadas X e Y respectivamente del punto a comprobar
//VARIABLES DE SALIDA: Un booleano, true si  hay colisión con la meta, false en caso contrario
function checkWin(checkPositionX,checkPositionY)
{
	checkPoint = game.add.sprite(checkPositionX,checkPositionY);
	var point = new Phaser.Point(checkPositionX,checkPositionY);
	game.physics.p2.enable(checkPoint, true);
	checkPoint.body.clearShapes();
	checkPoint.body.setCircle(1);
	var check = game.physics.p2.hitTest(point, [goal.body]);
	checkPoint.destroy();
	if(check.length)
		return true;
	else
		return false;
}

//cambiamos el estado del primer jugador y hacemos las comprobaciones y acciones necesarias dados estos cambios de estado,
//viendo si el jugador puede moverse a la posición que ha elegido y en caso afirmativo viendo si esa posición está en la meta.
//En su estado 0 el jugador elegirá el ángulo de lanzamiento por lo que su flecha direccional se moverá en un ángulo y a su vez
//el jugador podrá mover ese ángulo.
//En el estado 1 el jugador ya ha decidido su ángulo y no puede modificarlo, por lo que estará escogiendo la distancia que recorre.
//La flecha crecerá y decrecerá intermitentemente en este estado y al decidirse una distancia se comprobará si el punto elegido
//está dentro de un muro y en caso negativo si está en la meta.
//Si puede moverse lo hará y si no ha dado con la meta o no se ha movido pasará al estado 0 de nuevo.
//El estado 2 hace que el jugador esté inactivo. Se usa antes de empezar la carrera y al llegar a la meta
function changeState1()
{
	
	if(match.player1State===0)
			{
				match.player1State = 1;
				match.timeCounter1 = game.rnd.integerInRange(0, 50)/100;
				match.player1ArrowDirection=true;
				AngleLineLeftP1.visible = false;
				AngleLineRightP1.visible = false;
			}
			else if(match.player1State===1)
			{
				var positionXcheck = Math.cos(match.DirectionArrowP1.rotation)*match.DirectionArrowP1.width;
				var positionYcheck = Math.sin(match.DirectionArrowP1.rotation)*match.DirectionArrowP1.width;
				match.player1State = 0;
				AngleLineLeftP1.visible = true;
				AngleLineRightP1.visible = true;
				if(checkPos(positionXcheck+match.DirectionArrowP1.x,positionYcheck+match.DirectionArrowP1.y)
				&& positionXcheck+match.DirectionArrowP1.x>0 && positionXcheck+match.DirectionArrowP1.x<800
				&& positionYcheck+match.DirectionArrowP1.y>0 && positionYcheck+match.DirectionArrowP1.y<600)
				{
					match.player1StartMovePositionX = player1.x;
					match.player1StartMovePositionY = player1.y;
					match.player1FinalMovePositionX = positionXcheck+match.DirectionArrowP1.x;
					match.player1FinalMovePositionY = positionYcheck+match.DirectionArrowP1.y;
					match.player1State = 3;
					match.timeCounter1 = 0;
					AngleLineLeftP1.visible = false;
					AngleLineRightP1.visible = false;
				}
			}
}

//cambiamos el estado del segundo jugador y hacemos las comprobaciones y acciones necesarias dados estos cambios de estado,
//viendo si el jugador puede moverse a la posición que ha elegido y en caso afirmativo viendo si esa posición está en la meta
//En su estado 0 el jugador elegirá el ángulo de lanzamiento por lo que su flecha direccional se moverá en un ángulo y a su vez
//el jugador podrá mover ese ángulo.
//En el estado 1 el jugador ya ha decidido su ángulo y no puede modificarlo, por lo que estará escogiendo la distancia que recorre.
//La flecha crecerá y decrecerá intermitentemente en este estado y al decidirse una distancia se comprobará si el punto elegido
//está dentro de un muro y en caso negativo si está en la meta.
//Si puede moverse lo hará y si no ha dado con la meta o no se ha movido pasará al estado 0 de nuevo.
//El estado 2 hace que el jugador esté inactivo. Se usa antes de empezar la carrera y al llegar a la meta
function changeState2()
{
	
	if(match.player2State===0)
			{
				match.player2State = 1;
				match.timeCounter2 = game.rnd.integerInRange(0, 50)/100;
				match.player2ArrowDirection=true;
				AngleLineLeftP2.visible = false;
				AngleLineRightP2.visible = false;
			}
			else if(match.player2State===1)
			{
				var positionXcheck = Math.cos(match.DirectionArrowP2.rotation)*match.DirectionArrowP2.width;
				var positionYcheck = Math.sin(match.DirectionArrowP2.rotation)*match.DirectionArrowP2.width;
				match.player2State = 0;
				AngleLineLeftP2.visible = true;
				AngleLineRightP2.visible = true;
				if(checkPos(positionXcheck+match.DirectionArrowP2.x,positionYcheck+match.DirectionArrowP2.y)
				&& positionXcheck+match.DirectionArrowP2.x>0 && positionXcheck+match.DirectionArrowP2.x<800
				&& positionYcheck+match.DirectionArrowP2.y>0 && positionYcheck+match.DirectionArrowP2.y<600)
				{
					match.player2StartMovePositionX = player2.x;
					match.player2StartMovePositionY = player2.y;
					match.player2FinalMovePositionX = positionXcheck+match.DirectionArrowP2.x;
					match.player2FinalMovePositionY = positionYcheck+match.DirectionArrowP2.y;
					match.player2State = 3;
					match.timeCounter2 = 0;
					AngleLineLeftP2.visible = false;
					AngleLineRightP2.visible = false;
				}
			}
}

//Reasignamos un ángulo aleatorio a la flecha de dirección del primer jugador
function setArrow1()
{
	var angle = game.rnd.integerInRange(0, 60);
	match.timeCounter1 = game.math.linear(0,0.5,angle/60);
	match.DirectionArrowP1.angle = AngleLineRightP1.angle-angle;
	match.player1ArrowDirection = true;
}

//Reasignamos un ángulo aleatorio a la flecha de dirección del segundo jugador
function setArrow2()
{
	var angle = game.rnd.integerInRange(0, 60);
	match.timeCounter2 = game.math.linear(0,0.5,angle/60);
	match.DirectionArrowP2.angle = AngleLineRightP2.angle-angle;
	match.player2ArrowDirection = true;
}

//Hacemos que gire la flecha del primer jugador con una interpolación y un contador de tiempo.
function moveArrow1()
{
	match.timeCounter1+=game.time.elapsedMS/1000;
	if(match.player1ArrowDirection)
	{
		match.DirectionArrowP1.angle = AngleLineLeftP1.angle+game.math.linear(0, 60, match.timeCounter1/0.5); 
	}
	else
	{
		match.DirectionArrowP1.angle = AngleLineRightP1.angle-game.math.linear(0, 60, match.timeCounter1/0.5);
	}
	if(match.timeCounter1>=0.5)
	{
		match.timeCounter1=0;
		match.player1ArrowDirection=!match.player1ArrowDirection;
	}
}

//Hacemos que gire la flecha del segundo jugador con una interpolación y un contador de tiempo.
function moveArrow2()
{
	match.timeCounter2+=game.time.elapsedMS/1000;
	if(match.player2ArrowDirection)
	{
		match.DirectionArrowP2.angle = AngleLineLeftP2.angle+game.math.linear(0, 60, match.timeCounter2/0.5); 
	}
	else
	{
		match.DirectionArrowP2.angle = AngleLineRightP2.angle-game.math.linear(0, 60, match.timeCounter2/0.5);
	}
	if(match.timeCounter2>=0.5)
	{
		match.timeCounter2=0;
		match.player2ArrowDirection=!match.player2ArrowDirection;
	}
}

//cambiamos el tamaño de la flecha y ajustamos la distancia del movimiento del primer jugador con una interpolación
//y un contador de tiempo
function powerArrow1()
{
	match.timeCounter1+=game.time.elapsedMS/1000;
	if(match.timeCounter1>0.5)
	{
		match.timeCounter1=0;
		match.player1ArrowDirection=!match.player1ArrowDirection;
	}
	if(match.player1ArrowDirection)
	{
		var length = game.math.linear(0, 0.4, match.timeCounter1/0.5);
		match.DirectionArrowP1.scale.setTo(length, 0.3);
	}
	else
	{
		var length = game.math.linear(0, 0.4, (0.5-match.timeCounter1)/0.5);
		match.DirectionArrowP1.scale.setTo(length, 0.3);
	}
}

//cambiamos el tamaño de la flecha y ajustamos la distancia del segundo del segundo jugador con una interpolación
//y un contador de tiempo
function powerArrow2()
{
	match.timeCounter2+=game.time.elapsedMS/1000;
	if(match.timeCounter2>=0.5)
	{
		match.timeCounter2=0;
		match.player2ArrowDirection=!match.player2ArrowDirection;
	}
	if(match.player2ArrowDirection)
	{
		var length = game.math.linear(0, 0.4, match.timeCounter2/0.5);
		match.DirectionArrowP2.scale.setTo(length, 0.3);
	}
	else
	{
		var length = game.math.linear(0, 0.4, (0.5-match.timeCounter2)/0.5);
		match.DirectionArrowP2.scale.setTo(length, 0.3);
	}
}
//Esta función se utiliza para avanzar la animación del semáforo inicial
//y activar los controles de los jugadores una vez esta ha terminado
function semaforoCounter()
{
    if (semaforoAnimation.frame < semaforoAnimation.frameTotal-1) {
        semaforoAnimation.frame += 1;
    }
    else {
		match.player1State = 0;
		match.player2State = 0;
		semaforo.destroy();
		game.time.events.remove(match.timerSemaforo);
    }   
}

