PenRunner.matchState = function(game) {

}

PenRunner.matchState.prototype =
{
	create: function()
	{
		//nos aseguramos de que el fondo sea blanco	
		game.stage.backgroundColor = "#FFFFFF";
		//cogemos los jsons necesarios de la cache
		var trackJson = game.cache.getJSON('track');
		var collisionJson = game.cache.getJSON('wallsCollision');
		//metemos los sprites con sus colliders cuando son necesarios
		walls = game.add.sprite(trackJson.wallsPositionX,trackJson.wallsPositionY,'walls',{shape: collisionJson.wallsTrack});
		start = game.add.sprite(trackJson.startPositionX,trackJson.startPositionY,'start');
		goal = game.add.sprite(trackJson.goalPositionX,trackJson.goalPositionY,'goal');
		game.physics.enable(goal, Phaser.Physics.ARCADE);

		player1 = game.add.sprite(trackJson.startPositionX+40,trackJson.startPositionY,'player1');
		player1.anchor.setTo(0, 0);
		player1.angle += 45;
		player2 = game.add.sprite(trackJson.startPositionX+90,trackJson.startPositionY,'player2');
		player2.anchor.setTo(0, 0);
		player2.angle += 45;


		//flecha y ángulo del primer jugador
		AngleLineLeftP1 = game.add.sprite(trackJson.startPositionX+40,trackJson.startPositionY,'angleLine');
		AngleLineRightP1= game.add.sprite(trackJson.startPositionX+40,trackJson.startPositionY,'angleLine');
		DirectionArrowP1= game.add.sprite(trackJson.startPositionX+40,trackJson.startPositionY,'angleLine');

		AngleLineLeftP1.anchor.setTo(0, 0.5);
		AngleLineLeftP1.angle-=120;
		AngleLineRightP1.anchor.setTo(0, 0.5);
		AngleLineRightP1.angle-=60;
		DirectionArrowP1.anchor.setTo(0, 0.5);
		DirectionArrowP1.angle-=90;

		AngleLineLeftP1.scale.setTo(0.5, 0.5);
		AngleLineRightP1.scale.setTo(0.5, 0.5);
		DirectionArrowP1.scale.setTo(0.4, 0.3);

		//flecha y ángulo del segundo jugador

		AngleLineLeftP2 = game.add.sprite(trackJson.startPositionX+90,trackJson.startPositionY,'angleLine');
		AngleLineRightP2= game.add.sprite(trackJson.startPositionX+90,trackJson.startPositionY,'angleLine');
		DirectionArrowP2= game.add.sprite(trackJson.startPositionX+90,trackJson.startPositionY,'angleLine');

		AngleLineLeftP2.anchor.setTo(0, 0.5);
		AngleLineLeftP2.angle-=120;
		AngleLineRightP2.anchor.setTo(0, 0.5);
		AngleLineRightP2.angle-=60;
		DirectionArrowP2.anchor.setTo(0, 0.5);
		DirectionArrowP2.angle-=90;

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
	},

	update:function()
	{
		if (leftKeyP1.isDown)
        {
			AngleLineLeftP1.angle-=5;
			AngleLineRightP1.angle-=5;
			DirectionArrowP1.angle-=5;
		}
		else if (rightKeyP1.isDown)
        {
			AngleLineLeftP1.angle+=5;
			AngleLineRightP1.angle+=5;
			DirectionArrowP1.angle+=5;
		}
		if (leftKeyP2.isDown)
        {
			AngleLineLeftP2.angle-=5;
			AngleLineRightP2.angle-=5;
			DirectionArrowP2.angle-=5;
		}
		else if (rightKeyP2.isDown)
        {
			AngleLineLeftP2.angle+=5;
			AngleLineRightP2.angle+=5;
			DirectionArrowP2.angle+=5;
        }


	}
}

