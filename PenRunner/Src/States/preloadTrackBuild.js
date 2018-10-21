PenRunner.preloadTrackBuildState = function(game) {

}

PenRunner.preloadTrackBuildState.prototype =
{
	preload:function()
	{
		//Poner texto, imágenes, y todo lo que tenga que salir en la pantalla de carga ANTES de cargar las imágenes

        var text = "Loading...";
    	var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

		var t = game.add.text(game.world.centerX-150, game.world.centerY-100, text, style);
		
		//Archivos a cargar:

		var trackJson = game.cache.getJSON('track');

		game.load.image('walls',trackJson.wallsImage);
		game.load.json('wallsCollision',trackJson.wallsCollisionJson);
		game.load.image('start',trackJson.startImage);
		game.load.image('goal',trackJson.goalImage);
	},
	update: function()
	{

		game.state.start('matchState');

	}
}