PenRunner.preloadTrackBuildOnlineState = function(game) {

}

PenRunner.preloadTrackBuildOnlineState.prototype =
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
		var playerAssetsJson = game.cache.getJSON('playersAssets');
	

		//cargamos todos los assets leyendo las direcciones recogidas en el json del circuito
		game.load.image('walls',trackJson.wallsImage);
		game.load.physics('wallsCollision',trackJson.wallsCollisionJson);
		game.load.image('start',trackJson.startImage);
		game.load.image('goal',trackJson.goalImage);
		game.load.image('playerBlue',playerAssetsJson.assets[0].cursor);
		game.load.image('playerRed',playerAssetsJson.assets[1].cursor);
		game.load.image('playerGreen',playerAssetsJson.assets[2].cursor);
		game.load.image('playerPurple',playerAssetsJson.assets[3].cursor);
		game.load.image('playerYellow',playerAssetsJson.assets[4].cursor);
		game.load.image('playerCian',playerAssetsJson.assets[5].cursor);
		game.load.image('angleLineBlue',playerAssetsJson.assets[0].line);
		game.load.image('angleLineRed',playerAssetsJson.assets[1].line);
		game.load.image('angleLineGreen',playerAssetsJson.assets[2].line);
		game.load.image('angleLinePurple',playerAssetsJson.assets[3].line);
		game.load.image('angleLineYellow',playerAssetsJson.assets[4].line);
		game.load.image('angleLineCian',playerAssetsJson.assets[5].line);
		game.playerAssetsStrings = [
			["playerBlue","angleLineBlue"],
			["playerRed","angleLineRed"],
			["playerGreen","angleLineGreen"],
			["playerPurple","angleLinePurple"],
			["playerYellow","angleLineYellow"],
			["playerCian","angleLineCian"]
		];

		//
		game.load.atlasJSONHash('semaforo', 'Assets/semaforo.png', 'Src/json/semaforo.json');
	},
	update: function()
	{

		game.state.start('matchState');

	}
}