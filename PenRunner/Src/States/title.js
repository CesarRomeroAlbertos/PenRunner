PenRunner.titleState = function(game) {

}

PenRunner.titleState.prototype =
{
	create: function()
	{
		//cambio el fondo a blanco para que no contraste con la imagen de la portada
		game.stage.backgroundColor = "#FFFFFF";
		//ponemos la imagen de título (en el futuro será un sprite animado)
		s = game.add.sprite(0,40,'title')

		s.animations.add('anim');

		s.animations.play('anim', 30, true);

		//texto para indicar al jugador que debe hacer click para avanzar
		var text = "CLICK TO START";
		var style = { font: "32px Lucida Console", fill: "#000000", align: "center", fontWeight:"bold"};
		

		var t = game.add.text(game.world.centerX-128, game.world.centerY+220, text, style);

		//activamos el input del ratón por si estuviera desactivado
		game.input.mouse.capture = true;
	},
	update: function()
	{
		//al detectar un click cambiamos la escena
		if(game.input.activePointer.leftButton.isDown)
			game.state.start('preloadMenuState');

	}
}