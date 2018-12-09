PenRunner.preloadMatchOnlineState = function(game) {

}
var chosenTrack;
var playerId;

PenRunner.preloadMatchOnlineState.prototype =
{
	preload:function()
	{
		
			trackList = game.cache.getJSON('trackList');
			chosenTrack = trackList.tracks[game.chosenCircuit].json;
			game.load.json('track',chosenTrack);
		
		
			
		//Poner texto, imágenes, y todo lo que tenga que salir en la pantalla de carga ANTES de cargar las imágenes

        var text = "Loading...";
    	var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

		var t = game.add.text(game.world.centerX-150, game.world.centerY-100, text, style);
		
	},
	update: function()
	{
		
			game.state.start('preloadTrackBuildOnlineState');

	}

	
}