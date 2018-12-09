PenRunner.scoreState = function (game) { }


PenRunner.scoreState.prototype =
	{
		create: function () {
			var background = game.add.sprite(game.world.x, game.world.y - 25, 'backgroundScore'); //Añadimos un sprite al background
			background.scale.setTo(0.65, 1); //Escalamos la imagen del background
			var buttonReturn = game.add.button(game.world.x + 42, game.world.y + 40, 'return', this.actionONClickScore, this, 0, 0, 0); //Botón para volver al menú principal

			//Escalamos el boton de volver atrás
			buttonReturn.width = 35;
			buttonReturn.height = 40;
			
			var puntuacion1 = 10;
			var puntuacion2 = 8;

			//Creamos los sprites para los fondos de puntuación de los jugadores
			var jugador = game.add.sprite(game.world.x + 34, game.world.y + 110, 'jugador');
			var jugador2 = game.add.sprite(game.world.x + 34, game.world.y + 190, 'jugador');
			var jugador3 = game.add.sprite(game.world.x + 34, game.world.y + 270, 'jugador');
			var jugador4 = game.add.sprite(game.world.x + 34, game.world.y + 350, 'jugador');
			var jugador5 = game.add.sprite(game.world.x + 34, game.world.y + 430, 'jugador');
			var jugador6 = game.add.sprite(game.world.x + 34, game.world.y + 510, 'jugador');

			//Ponemos el texto de la puntuacion en el fondo correspondiente.
			game.add.text(game.world.x + 95, game.world.y + 132, '1. Jugador ' + goalOrder[0] + '.......................................... ' + puntuacion1 + ' pts', style2); //Imprime la posicion del primer jugador
			game.add.text(game.world.x + 95, game.world.y + 212, '2. Jugador ' + goalOrder[1] + '............................................ ' + puntuacion2 + ' pts', style2); //Imprime la posicion de

			//Se escala el fondo de puntuacion de los jugadores, a priori es un sprite muy básico, se cambiará mas adelante
			jugador.scale.setTo(1.6, 0.8);
			jugador2.scale.setTo(1.6, 0.8);
			jugador3.scale.setTo(1.6, 0.8);
			jugador4.scale.setTo(1.6, 0.8);
			jugador5.scale.setTo(1.6, 0.8);
			jugador6.scale.setTo(1.6, 0.8);

			//Texto de la puntuación final.
			var text = game.add.text(game.world.centerX - 222, game.world.centerY - 275, 'Puntuación Final', style5);
		},
		
		//Esta función se llama cuando clickamos el botón de volver atrás en la esquina superior izquierda, llevándonos de nuevo al menú principal.
		actionONClickScore: function ()
		{
			game.state.start('menuState');
		}

	}

