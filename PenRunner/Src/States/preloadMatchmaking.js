PenRunner.preloadMatchmakingState = function(game) {

}

PenRunner.preloadMatchmakingState.prototype =
{
	preload:function()
	{
		//Poner texto, imágenes, y todo lo que tenga que salir en la pantalla de carga ANTES de cargar las imágenes

    	var text = "Loading...";
    	var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

		var t = game.add.text(game.world.centerX-150, game.world.centerY-100, text, style);
		
		//Archivos a cargar:

		game.load.image('button', 'Assets/Mapa1.png', 200, 70);
		game.load.image('button2', 'Assets/Mapa2.png', 200, 70);
		game.load.image('button3', 'Assets/Mapa3.png', 200, 70);
		game.load.image('jugador', 'Assets/jugadores.png', 200, 70);
		game.load.image('background','Assets/starfield.jpg');
		

	},
	update: function()
	{

		game.state.start('matchmakingState');

	}
}
