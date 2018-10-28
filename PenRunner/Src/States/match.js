PenRunner.matchState = function(game) {

}

var walls;
var player1State;
var player2State;
var player1ArrowDirection;
var player2ArrowDirection;
var DirectionArrowP1;
var DirectionArrowP2;
var timeCounter1;
var timeCounter2;
var goalOrder;

PenRunner.matchState.prototype =
{
	create: function()
	{
		//nos aseguramos de que el fondo sea blanco	
		game.stage.backgroundColor = "#FFFFFF";
		//cogemos los jsons necesarios de la cache
		var trackJson = game.cache.getJSON('track');
		//metemos los sprites con sus colliders cuando son necesarios, todo leyendo del json del circuito
		walls = game.add.sprite(trackJson.wallsPositionX,trackJson.wallsPositionY,'walls');
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
		
		game.physics.p2.enable(walls, true);
		walls.body.x+=walls.width/2;
		walls.body.y+=walls.height/2;
		
		walls.body.clearShapes();
		walls.body.loadPolygon('wallsCollision', 'wallsTrack');
		walls.body.static = true;
		walls.body.debug=false;
		for(var i=0; i< walls.body.data.shapes.length;i++)
		{
			walls.body.data.shapes[i].sensor = true;
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
		DirectionArrowP1= game.add.sprite(player1.x,player1.y,'angleLine');

		AngleLineLeftP1.anchor.setTo(0, 0.5);
		AngleLineLeftP1.angle=trackJson.directionAngle-30;
		AngleLineRightP1.anchor.setTo(0, 0.5);
		AngleLineRightP1.angle=trackJson.directionAngle+30;
		DirectionArrowP1.anchor.setTo(0, 0.5);
		DirectionArrowP1.angle=trackJson.directionAngle;

		AngleLineLeftP1.scale.setTo(0.5, 0.5);
		AngleLineRightP1.scale.setTo(0.5, 0.5);
		DirectionArrowP1.scale.setTo(0.4, 0.3);

		//flecha y ángulo del segundo jugador

		AngleLineLeftP2 = game.add.sprite(player2.x,player2.y,'angleLine');
		AngleLineRightP2= game.add.sprite(player2.x,player2.y,'angleLine');
		DirectionArrowP2= game.add.sprite(player2.x,player2.y,'angleLine');

		AngleLineLeftP2.anchor.setTo(0, 0.5);
		AngleLineLeftP2.angle=trackJson.directionAngle-30;
		AngleLineRightP2.anchor.setTo(0, 0.5);
		AngleLineRightP2.angle=trackJson.directionAngle+30;
		DirectionArrowP2.anchor.setTo(0, 0.5);
		DirectionArrowP2.angle=trackJson.directionAngle;

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

		forwardKeyP1.onDown.add(changeState1, this);
		forwardKeyP2.onDown.add(changeState2, this);

		//inicializamos variables de la escena

		player1State = 0;
		player2State = 0;
		player1ArrowDirection = true;
		player2ArrowDirection = true;
		timeCounter1 = 0;
		timeCounter2 = 0;
		goalOrder = new Array();

		setArrow1();
		setArrow2();
	},

	update:function()
	{
		//usamos update para los distintos controles
		if (leftKeyP1.isDown && player1State==0)
        {
			AngleLineLeftP1.angle-=5;
			AngleLineRightP1.angle-=5;
			player1.angle-=5;
		}
		else if (rightKeyP1.isDown && player1State==0)
        {
			AngleLineLeftP1.angle+=5;
			AngleLineRightP1.angle+=5;
			player1.angle+=5;
		}
		if (leftKeyP2.isDown && player2State==0)
        {
			AngleLineLeftP2.angle-=5;
			AngleLineRightP2.angle-=5;
			player2.angle-=5;
		}
		else if (rightKeyP2.isDown && player2State==0)
        {
			AngleLineLeftP2.angle+=5;
			AngleLineRightP2.angle+=5;
			player2.angle+=5;
		}

		if (player1State==0)
		{
			moveArrow1();
		}
		else if(player1State==1)
		{
			powerArrow1();
		}

		if (player2State==0)
		{
			moveArrow2();
		}
		else if(player2State==1)
		{
			powerArrow2();
		}

		if(goalOrder.length>=2)
		{
			game.state.start('preloadScoreState');
		}
	}
}

//comprobamos si se puede mover un jugador a una posición o está en un muro
function checkPos(checkPositionX,checkPositionY)
{
	checkPoint = game.add.sprite(checkPositionX,checkPositionY);
	var point = new Phaser.Point(checkPositionX,checkPositionY);
	game.physics.p2.enable(checkPoint, true);
	checkPoint.body.clearShapes();
	checkPoint.body.setCircle(1);
	var check = game.physics.p2.hitTest(point, [walls.body]);
	checkPoint.destroy();
	if(check.length)
		return false;
	else
		return true;
}

//comprobamos si una posición se encuentra en la meta
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

//cambiamos el estado del primer jugador y hacemos las comprobaciones y acciones necesarias dados estos cambios de estado
function changeState1()
{
	if(player1State===0)
			{
				player1State = 1;
				timeCounter1 = game.rnd.integerInRange(0, 50)/100;
				player1ArrowDirection=true;
				AngleLineLeftP2.visible = false;
				AngleLineRightP2.visible = false;
			}
			else if(player1State===1)
			{
				var positionXcheck = Math.cos(DirectionArrowP1.rotation)*DirectionArrowP1.width;
				var positionYcheck = Math.sin(DirectionArrowP1.rotation)*DirectionArrowP1.width;
				player1State = 0;
				AngleLineLeftP2.visible = true;
				AngleLineRightP2.visible = true;
				if(checkPos(positionXcheck+DirectionArrowP1.x,positionYcheck+DirectionArrowP1.y)
				&& positionXcheck+DirectionArrowP1.x>0 && positionXcheck+DirectionArrowP1.x<800
				&& positionYcheck+DirectionArrowP1.y>0 && positionYcheck+DirectionArrowP1.y<600)
				{
					if(checkWin(positionXcheck+DirectionArrowP1.x,positionYcheck+DirectionArrowP1.y))
					{
						goalOrder.push(1);
						player1State=2;
						AngleLineLeftP1.visible = false;
						AngleLineRightP1.visible = false;
						DirectionArrowP1.visible = false
					}
					player1.x+=positionXcheck;
					player1.y+=positionYcheck;
					AngleLineLeftP1.x+=positionXcheck;
					AngleLineLeftP1.y+=positionYcheck;
					AngleLineRightP1.x+=positionXcheck;
					AngleLineRightP1.y+=positionYcheck;
					DirectionArrowP1.x+=positionXcheck;
					DirectionArrowP1.y+=positionYcheck;
				}
				DirectionArrowP1.scale.setTo(0.4, 0.3);
				setArrow1();
			}
}

//cambiamos el estado del segundo jugador y hacemos las comprobaciones y acciones necesarias dados estos cambios de estado
function changeState2()
{
	if(player2State===0)
			{
				player2State = 1;
				timeCounter2 = game.rnd.integerInRange(0, 50)/100;
				player2ArrowDirection=true;
				AngleLineLeftP2.visible = false;
				AngleLineRightP2.visible = false;
			}
			else if(player2State===1)
			{
				var positionXcheck = Math.cos(DirectionArrowP2.rotation)*DirectionArrowP2.width;
				var positionYcheck = Math.sin(DirectionArrowP2.rotation)*DirectionArrowP2.width;
				player2State = 0;
				AngleLineLeftP2.visible = true;
				AngleLineRightP2.visible = true;
				if(checkPos(positionXcheck+DirectionArrowP2.x,positionYcheck+DirectionArrowP2.y)
				&& positionXcheck+DirectionArrowP2.x>0 && positionXcheck+DirectionArrowP2.x<800
				&& positionYcheck+DirectionArrowP2.y>0 && positionYcheck+DirectionArrowP2.y<600)
				{
					if(checkWin(positionXcheck+DirectionArrowP2.x,positionYcheck+DirectionArrowP2.y))
					{
						goalOrder.push(2);
						player2State=2;
						AngleLineLeftP2.visible = false;
						AngleLineRightP2.visible = false;
						DirectionArrowP2.visible = false;
					}
					player2.x+=positionXcheck;
					player2.y+=positionYcheck;
					AngleLineLeftP2.x+=positionXcheck;
					AngleLineLeftP2.y+=positionYcheck;
					AngleLineRightP2.x+=positionXcheck;
					AngleLineRightP2.y+=positionYcheck;
					DirectionArrowP2.x+=positionXcheck;
					DirectionArrowP2.y+=positionYcheck;
				}
				DirectionArrowP2.scale.setTo(0.4, 0.3);
				setArrow2();
			}
}

//recalculaos una posición para la flecha de dirección del primer jugador
function setArrow1()
{
	var angle = game.rnd.integerInRange(0, 60);
	timeCounter1 = game.math.linear(0,0.5,angle/60);
	DirectionArrowP1.angle = AngleLineRightP1.angle-angle;
	player1ArrowDirection = true;
}

//recalculaos una posición para la flecha de dirección del segundo jugador
function setArrow2()
{
	var angle = game.rnd.integerInRange(0, 60);
	timeCounter2 = game.math.linear(0,0.5,angle/60);
	DirectionArrowP2.angle = AngleLineRightP2.angle-angle;
	player2ArrowDirection = true;
}

//hacemos que gire la flecha del primer jugador
function moveArrow1()
{
	timeCounter1+=game.time.elapsedMS/1000;
	if(player1ArrowDirection)
	{
		DirectionArrowP1.angle = AngleLineLeftP1.angle+game.math.linear(0, 60, timeCounter1/0.5); 
	}
	else
	{
		DirectionArrowP1.angle = AngleLineRightP1.angle-game.math.linear(0, 60, timeCounter1/0.5);
	}
	if(timeCounter1>=0.5)
	{
		timeCounter1=0;
		player1ArrowDirection=!player1ArrowDirection;
	}
}

//hacemos que gire la flecha del segundo jugador
function moveArrow2()
{
	timeCounter2+=game.time.elapsedMS/1000;
	if(player2ArrowDirection)
	{
		DirectionArrowP2.angle = AngleLineLeftP2.angle+game.math.linear(0, 60, timeCounter2/0.5); 
	}
	else
	{
		DirectionArrowP2.angle = AngleLineRightP2.angle-game.math.linear(0, 60, timeCounter2/0.5);
	}
	if(timeCounter2>=0.5)
	{
		timeCounter2=0;
		player2ArrowDirection=!player2ArrowDirection;
	}
}

//cambiamos el tamaño de la flecha y ajustamos la distancia del movimiento del primer jugador
function powerArrow1()
{
	timeCounter1+=game.time.elapsedMS/1000;
	if(timeCounter1>0.5)
	{
		timeCounter1=0;
		player1ArrowDirection=!player1ArrowDirection;
	}
	if(player1ArrowDirection)
	{
		var length = game.math.linear(0, 0.4, timeCounter1/0.5);
		DirectionArrowP1.scale.setTo(length, 0.3);
	}
	else
	{
		var length = game.math.linear(0, 0.4, (0.5-timeCounter1)/0.5);
		DirectionArrowP1.scale.setTo(length, 0.3);
	}
}

//cambiamos el tamaño de la flecha y ajustamos la distancia del segundo del primer jugador
function powerArrow2()
{
	timeCounter2+=game.time.elapsedMS/1000;
	if(timeCounter2>=0.5)
	{
		timeCounter2=0;
		player2ArrowDirection=!player2ArrowDirection;
	}
	if(player2ArrowDirection)
	{
		var length = game.math.linear(0, 0.4, timeCounter2/0.5);
		DirectionArrowP2.scale.setTo(length, 0.3);
	}
	else
	{
		var length = game.math.linear(0, 0.4, (0.5-timeCounter2)/0.5);
		DirectionArrowP2.scale.setTo(length, 0.3);
	}
}

