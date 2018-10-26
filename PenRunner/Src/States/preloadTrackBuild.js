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

		//tomamos el json que hemos cargado en la escena anterior
		var trackJson = game.cache.getJSON('track');

		//cargamos todos los assets leyendo las direcciones recogidas en el json del circuito
		game.load.image('walls',trackJson.wallsImage);
		game.load.physics('wallsCollision',trackJson.wallsCollisionJson);
		game.load.image('start',trackJson.startImage);
		game.load.image('goal',trackJson.goalImage);
		game.load.image('player1',"Assets/cursor_azul.png");
		game.load.image('player2',"Assets/cursor_rojo.png");
		game.load.image('angleLine',"Assets/AngleBar.png");
	},
	update: function()
	{

		game.state.start('matchState');

	}
}