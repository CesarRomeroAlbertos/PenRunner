PenRunner.preloadMatchmakingState = function(game) {

}

PenRunner.preloadMatchmakingState.prototype =
{
	preload:function()
	{
		//Poner texto, imágenes, y todo lo que tenga que salir en la pantalla de carga ANTES de cargar las imágeness

    	var text = "Loading...";
    	var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

		var t = game.add.text(game.world.centerX-150, game.world.centerY-100, text, style);
	

	},
	update: function()
	{

		game.state.start('matchmakingState');

	}
}
