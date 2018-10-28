PenRunner.preloadScoreState = function(game) {

}

PenRunner.preloadScoreState.prototype =
{
	preload:function()
	{
		//Poner texto, imágenes, y todo lo que tenga que salir en la pantalla de carga ANTES de cargar las imágenes

        var text = "Loading...";
    	var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

		var t = game.add.text(game.world.centerX-150, game.world.centerY-100, text, style);
		
		//Archivos a cargar:
		game.load.image('background','Assets/Fondo_fin_partida.jpg', 200, 70);
		game.load.image('jugador', 'Assets/jugadores.png', 200, 70);
		game.load.image('return', 'Assets/atras.png', 200, 70);
		
		
	},
	update: function()
	{

		game.state.start('scoreState');

	}
}