PenRunner.preloadMatchState = function(game) {

}

PenRunner.preloadMatchState.prototype =
{
	preload:function()
	{
		var chosenTrack = 'Src/json/track1.json';
		//Poner texto, imágenes, y todo lo que tenga que salir en la pantalla de carga ANTES de cargar las imágenes

        var text = "Loading...";
    	var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

		var t = game.add.text(game.world.centerX-150, game.world.centerY-100, text, style);
		
		//Archivos a cargar:

		game.load.json('track',chosenTrack);
	},
	update: function()
	{

		game.state.start('preloadTrackBuildState');

	}
}