PenRunner.preloadState = function(game) {

}

PenRunner.preloadState.prototype =
{
	preload:function()
	{

		//Ponemos un texto para que el jugador vea que está en una pantalla de carga
    	var text = "Loading...";
    	var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

    	var t = game.add.text(game.world.centerX-150, game.world.centerY-100, text, style);
    	

	},
	update: function()
	{

		game.state.start('menuState');

	}
}