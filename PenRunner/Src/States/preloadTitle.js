PenRunner.preloadTitleState = function(game) {

}

PenRunner.preloadTitleState.prototype =
{
	preload:function()
	{
		//Poner texto, imágenes, y todo lo que tenga que salir en la pantalla de carga ANTES de cargar las imágenes

		var text = "Loading...";
    	var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

		var t = game.add.text(game.world.centerX-150, game.world.centerY-100, text, style);
		
		//Archivos a cargar:
		
		game.load.atlasJSONHash('title', 'Assets/titleSpritesheet.png', 'Src/json/titleSpritesheet.json');
	},
	update: function()
	{

		game.state.start('titleState');

	}
}