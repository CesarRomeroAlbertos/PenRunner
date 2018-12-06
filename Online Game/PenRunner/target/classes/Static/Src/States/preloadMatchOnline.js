PenRunner.preloadMatchOnlineState = function(game) {

}
var chosenTrack;
var playerId;

PenRunner.preloadMatchOnlineState.prototype =
{
	preload:function()
	{
		console.log(game.chosenCircuit);
			trackList = game.cache.getJSON('trackList');
			chosenTrack = trackList.tracks[game.chosenCircuit].json;
			game.load.json('track',chosenTrack);
			game.state.start('preloadTrackBuildOnlineState');
		
			
		//Poner texto, imágenes, y todo lo que tenga que salir en la pantalla de carga ANTES de cargar las imágenes

        var text = "Loading...";
    	var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

		var t = game.add.text(game.world.centerX-150, game.world.centerY-100, text, style);
		
		//Archivos a cargar:

		//leemos el json del circuito elegido
	
		
	},
	update: function()
	{

		

	}
	
}