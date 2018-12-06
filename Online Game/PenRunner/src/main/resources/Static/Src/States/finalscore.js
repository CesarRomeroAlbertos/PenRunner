PenRunner.scoreState = function(game) {}


PenRunner.scoreState.prototype =
{
	create: function()
	{
		var background = game.add.sprite(game.world.x, game.world.y-25, 'backgroundScore'); //Añadimos un sprite al background
		background.scale.setTo(0.65, 1); //Escalamos la imagen del background
		var buttonReturn = game.add.button(game.world.x+20, game.world.y+20, 'return', null, this, 0, 0, 0); //Botón para volver al menú principal
		
		//escalamos el boton de volver atrás
		buttonReturn.width = 40;
		buttonReturn.height = 40;
		//Esta instrucción detecta cuando se ha pulsado el botón de vuelta atrás y ejecuta el bloque de código en la función actionOnClickScore()
		buttonReturn.onInputUp.add(actionONClickScore, this);

		//De momento, las puntuaciones son estaticas, más adelante, se guardarán en función de la escena anterior



	//	for(var i= 0; i < 2; i++)
		//{
		////	if(goalOrder[0]==1)
		//	{
				var puntuacion1=10;
				var puntuacion2=8;
		/*}
			else
			{
				puntuacion2+=10;
				puntuacion1+=8;
			}*/
		//}

		//Creamos los sprites para los fondos de puntuación de los jugadores
		var jugador = game.add.sprite(game.world.x+65, game.world.y+140, 'jugador');
        var jugador2 = game.add.sprite(game.world.x+65, game.world.y+210, 'jugador');
        var jugador3 = game.add.sprite(game.world.x+65, game.world.y+290, 'jugador');
        var jugador4 = game.add.sprite(game.world.x+65, game.world.y+370, 'jugador');
        var jugador5 = game.add.sprite(game.world.x+65, game.world.y+450, 'jugador');
		var jugador6 = game.add.sprite(game.world.x+65, game.world.y+530, 'jugador');
		
		//Ponemos el texto de la puntuacion en el fondo correspondiente.
		game.add.text(game.world.x+120, game.world.y+165, '1. Jugador ' + goalOrder[0] + '.......................................... ' + puntuacion1 + ' pts', style3); //Imprime la posicion del primer jugador
		game.add.text(game.world.x+120, game.world.y+235, '2. Jugador ' + goalOrder[1] + '............................................ ' + puntuacion2 + ' pts', style3); //Imprime la posicion de

		//Se escala el fondo de puntuacion de los jugadores, a priori es un sprite muy básico, se cambiará mas adelante
	 	jugador.scale.setTo(1.6, 0.8);
	 	jugador2.scale.setTo(1.6, 0.8);
	    jugador3.scale.setTo(1.6, 0.8);
	    jugador4.scale.setTo(1.6, 0.8);
	    jugador5.scale.setTo(1.6, 0.8);
		jugador6.scale.setTo(1.6, 0.8);
		
		//Texto de la puntuación final.
		var text = game.add.text(game.world.centerX-220, game.world.centerY-230, 'Puntuación Final', style4);
	}

}
//esta función se llama cuando clickamos el botón de volver atrás en la esquina superior izquierda, llevándonos de nuevo al menú principal.
function actionONClickScore() 
{
	game.state.start('menuState');
}