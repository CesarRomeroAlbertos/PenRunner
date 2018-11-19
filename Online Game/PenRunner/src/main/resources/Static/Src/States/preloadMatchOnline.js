PenRunner.preloadMatchOnlineState = function(game) {

}
var chosenTrack;
PenRunner.preloadMatchOnlineState.prototype =
{
	preload:function()
	{
		var trackList = game.cache.getJSON('trackList');
		chosenTrack = trackList.tracks[chosenCircuit].json;
		
		//Poner texto, imágenes, y todo lo que tenga que salir en la pantalla de carga ANTES de cargar las imágenes

        var text = "Loading...";
    	var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

		var t = game.add.text(game.world.centerX-150, game.world.centerY-100, text, style);
		
		//Archivos a cargar:

		//leemos el json del circuito elegido
	
		game.load.json('track',chosenTrack);
	},
	update: function()
	{

		game.state.start('preloadTrackBuildState');

	}
}