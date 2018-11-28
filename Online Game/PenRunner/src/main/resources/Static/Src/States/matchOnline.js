PenRunner.matchOnlineState = function(game) {}

//variable global donde están encapsuladas las variables a las que necesitamos acceder desde fuera del prototype de la escena
var match={};
function matchData(){return this;}

PenRunner.matchOnlineState.prototype =
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

		player = game.add.sprite(game.math.linear(trackJson.playerPositionXzero,trackJson.playerPositionXone,1/3),
		game.math.linear(trackJson.playerPositionYzero,trackJson.playerPositionYone,1/3),'player1');
		player.anchor.setTo(0, 0);
		player.scale.setTo(0.15,0.15);
		player.angle += trackJson.playerAngle;


		//flecha y ángulo del primer jugador
		AngleLineLeft = game.add.sprite(player.x,player.y,'angleLine');
		AngleLineRight= game.add.sprite(player.x,player.y,'angleLine');
		match.DirectionArrow= game.add.sprite(player.x,player.y,'angleLineBlue');

		AngleLineLeft.anchor.setTo(0, 0.5);
		AngleLineLeft.angle=trackJson.directionAngle-30;
		AngleLineRight.anchor.setTo(0, 0.5);
		AngleLineRight.angle=trackJson.directionAngle+30;
		match.DirectionArrow.anchor.setTo(0, 0.5);
		match.DirectionArrow.angle=trackJson.directionAngle;

		AngleLineLeft.scale.setTo(0.5, 0.5);
		AngleLineRight.scale.setTo(0.5, 0.5);
		match.DirectionArrow.scale.setTo(0.4, 0.3);

		
		//controles

		leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
		rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
		forwardKey = game.input.keyboard.addKey(Phaser.Keyboard.W);


		forwardKey.onDown.add(changeState1, this);


		//inicializamos variables de la escena

		match.playerState = 2;

		match.playerArrowDirection = true;

		match.timeCounter = 0;

		match.goalOrder = new Array();

		setArrow1();


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
		if (leftKey.isDown && match.playerState==0)
        {
			AngleLineLeft.angle-=5;
			AngleLineRight.angle-=5;
			player.angle-=5;
		}
		//tecla derecha jugador 1
		else if (rightKey.isDown && match.playerState==0)
        {
			AngleLineLeft.angle+=5;
			AngleLineRight.angle+=5;
			player.angle+=5;
		}

		//aquí llamamos a los métodos que giran la dirección de los jugadores o cambian la distancia que se mueven en función de su estado
		if (match.playerState==0)
		{
			moveArrow1();
		}
		else if(match.playerState==1)
		{
			powerArrow1();
		}
		else if(match.playerState==3)
		{
			match.timeCounter+=game.time.elapsedMS/1000;
			match.player.x = game.math.linear(match.playerStartMovePositionX,playerFinalMovePositionX,
				Math.min(match.timeCounter/0.3,1));
			match.player.y = game.math.linear(match.playerStartMovePositionY,playerFinalMovePositionY,
				Math.min(match.timeCounter/0.3,1));
			if(match.timeCounter>=0.3)
				{
					match.playerState = 0;
					var line = game.add.sprite(match.playerStartMovePositionX,match.playerStartMovePositionY,'angleLineBlue');
					line.angle = match.DirectionArrow.angle;
					line.scale.setTo(match.DirectionArrow.scale.x, match.DirectionArrow.scale.y);
					AngleLineLeft.x=match.player.x;
					AngleLineLeft.y=match.player.y;
					AngleLineRight.x=match.player.x;
					AngleLineRight.y=match.player.y;
					AngleLineLeft.visible = true;
					AngleLineRight.visible = true;
					match.DirectionArrow.x=match.player.x;
					match.DirectionArrow.y=match.player.y;
					match.DirectionArrow.scale.setTo(0.4, 0.3);
					setArrow1();
					if(checkWin(match.player.x,match.player.y))
					{
						match.goalOrder.push(1);
						match.playerState=2;
						AngleLineLeft.visible = false;
						AngleLineRight.visible = false;
						match.DirectionArrow.visible = false
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
function changeState()
{
	
	if(match.playerState===0)
			{
				match.playerState = 1;
				match.timeCounter = game.rnd.integerInRange(0, 50)/100;
				match.playerArrowDirection=true;
				AngleLineLeft.visible = false;
				AngleLineRight.visible = false;
			}
			else if(match.playerState===1)
			{
				var positionXcheck = Math.cos(match.DirectionArrow.rotation)*match.DirectionArrow.width;
				var positionYcheck = Math.sin(match.DirectionArrow.rotation)*match.DirectionArrow.width;
				match.playerState = 0;
				AngleLineLeft.visible = true;
				AngleLineRight.visible = true;
				if(checkPos(positionXcheck+match.DirectionArrow.x,positionYcheck+match.DirectionArrow.y)
				&& positionXcheck+match.DirectionArrow.x>0 && positionXcheck+match.DirectionArrow.x<800
				&& positionYcheck+match.DirectionArrow.y>0 && positionYcheck+match.DirectionArrow.y<600)
				{
					match.playerStartMovePositionX = player.x;
					match.playerStartMovePositionY = player.y;
					match.playerFinalMovePositionX = positionXcheck+match.DirectionArrow.x;
					match.playerFinalMovePositionY = positionYcheck+match.DirectionArrow.y;
					match.playerState = 3;
					match.timeCounter = 0;
					AngleLineLeft.visible = false;
					AngleLineRight.visible = false;
				}
				match.DirectionArrow.scale.setTo(0.4, 0.3);
			}
}

//Reasignamos un ángulo aleatorio a la flecha de dirección del primer jugador
function setArrow()
{
	var angle = game.rnd.integerInRange(0, 60);
	match.timeCounter = game.math.linear(0,0.5,angle/60);
	match.DirectionArrow.angle = AngleLineRight.angle-angle;
	match.playerArrowDirection = true;
}

//Hacemos que gire la flecha del primer jugador con una interpolación y un contador de tiempo.
function moveArrow()
{
	match.timeCounter+=game.time.elapsedMS/1000;
	if(match.playerArrowDirection)
	{
		match.DirectionArrow.angle = AngleLineLeft.angle+game.math.linear(0, 60, match.timeCounter/0.5); 
	}
	else
	{
		match.DirectionArrow.angle = AngleLineRight.angle-game.math.linear(0, 60, match.timeCounter/0.5);
	}
	if(match.timeCounter>=0.5)
	{
		match.timeCounter=0;
		match.playerArrowDirection=!match.playerArrowDirection;
	}
}

//cambiamos el tamaño de la flecha y ajustamos la distancia del movimiento del primer jugador con una interpolación
//y un contador de tiempo
function powerArrow()
{
	match.timeCounter+=game.time.elapsedMS/1000;
	if(match.timeCounter>0.5)
	{
		match.timeCounter=0;
		match.playerArrowDirection=!match.playerArrowDirection;
	}
	if(match.playerArrowDirection)
	{
		var length = game.math.linear(0, 0.4, match.timeCounter/0.5);
		match.DirectionArrow.scale.setTo(length, 0.3);
	}
	else
	{
		var length = game.math.linear(0, 0.4, (0.5-match.timeCounter)/0.5);
		match.DirectionArrow.scale.setTo(length, 0.3);
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
		match.playerState = 0;
		match.player2State = 0;
		semaforo.destroy();
		game.time.events.remove(match.timerSemaforo);
    }   
}

function sendPlayerUpdate()
{

}

function updatePlayers()
{
	
}

