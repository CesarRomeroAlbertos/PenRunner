PenRunner.preloadMatchmakingState = function(game) {

}

PenRunner.preloadMatchmakingState.prototype =
{
	preload:function()
	{
		//Poner texto, imágenes, y todo lo que tenga que salir en la pantalla de carga ANTES de cargar las imágenes
	//	game.cache = new Phaser.Cache(game);

    	var text = "Loading...";
    	var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

		var t = game.add.text(game.world.centerX-150, game.world.centerY-100, text, style);
		
		//Archivos a cargar:

		

	},
	update: function()
	{

		game.state.start('matchmakingState');

	}
}
